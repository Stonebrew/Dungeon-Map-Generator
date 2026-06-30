import { getPayPalAccessToken, getPayPalSubscription, getRequiredEnv, verifyPayPalWebhookSignature, type PayPalWebhookVerificationHeaders } from '../lib/paypalServer.js';
import { getSupabaseAdminClient } from '../lib/supabaseAdmin.js';

type VercelRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (statusCode: number) => {
    json: (body: unknown) => void;
  };
};

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: unknown;
};

type PayPalWebhookResource = {
  id?: unknown;
  billing_agreement_id?: unknown;
  subscription_id?: unknown;
};

const SUBSCRIPTION_EVENTS = new Set([
  'BILLING.SUBSCRIPTION.ACTIVATED',
  'BILLING.SUBSCRIPTION.UPDATED',
  'BILLING.SUBSCRIPTION.CANCELLED',
  'BILLING.SUBSCRIPTION.SUSPENDED',
  'BILLING.SUBSCRIPTION.EXPIRED',
  'BILLING.SUBSCRIPTION.CREATED',
]);

const PAYMENT_EVENTS = new Set(['BILLING.SUBSCRIPTION.PAYMENT.FAILED', 'PAYMENT.SALE.COMPLETED', 'PAYMENT.SALE.REFUNDED', 'PAYMENT.SALE.REVERSED']);

function getHeaderValue(headers: VercelRequest['headers'], name: string) {
  const directValue = headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
  return Array.isArray(directValue) ? directValue[0] : directValue;
}

function getRequiredWebhookHeaders(req: VercelRequest): PayPalWebhookVerificationHeaders | undefined {
  const transmissionId = getHeaderValue(req.headers, 'paypal-transmission-id');
  const transmissionTime = getHeaderValue(req.headers, 'paypal-transmission-time');
  const certUrl = getHeaderValue(req.headers, 'paypal-cert-url');
  const authAlgo = getHeaderValue(req.headers, 'paypal-auth-algo');
  const transmissionSig = getHeaderValue(req.headers, 'paypal-transmission-sig');

  if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
    return undefined;
  }

  return {
    transmissionId,
    transmissionTime,
    certUrl,
    authAlgo,
    transmissionSig,
  };
}

function parseWebhookEvent(body: unknown): PayPalWebhookEvent | undefined {
  if (typeof body === 'string') {
    try {
      return parseWebhookEvent(JSON.parse(body));
    } catch {
      return undefined;
    }
  }

  if (!body || typeof body !== 'object') {
    return undefined;
  }

  return body as PayPalWebhookEvent;
}

function getResourceObject(resource: unknown): PayPalWebhookResource {
  return resource && typeof resource === 'object' ? (resource as PayPalWebhookResource) : {};
}

function getStringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getSubscriptionId(event: PayPalWebhookEvent) {
  const resource = getResourceObject(event.resource);

  if (event.event_type && SUBSCRIPTION_EVENTS.has(event.event_type)) {
    return getStringValue(resource.id);
  }

  return getStringValue(resource.billing_agreement_id) ?? getStringValue(resource.subscription_id) ?? getStringValue(resource.id);
}

function getWebhookStatus(eventType: string, paypalStatus: string | undefined) {
  if (eventType === 'BILLING.SUBSCRIPTION.PAYMENT.FAILED') {
    return 'PAYMENT_FAILED';
  }

  return paypalStatus ?? 'UNKNOWN';
}

async function isWebhookEventAlreadyProcessed(eventId: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from('paypal_webhook_events').select('id').eq('event_id', eventId).maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

async function recordWebhookEvent(eventId: string, eventType: string, subscriptionId: string | undefined) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('paypal_webhook_events').insert({
    provider: 'paypal',
    event_id: eventId,
    event_type: eventType,
    provider_subscription_id: subscriptionId ?? null,
  });

  if (error && error.code !== '23505') {
    throw error;
  }
}

async function updateKnownSubscription(eventType: string, subscriptionId: string, accessToken: string) {
  const expectedPlanId = getRequiredEnv('PAYPAL_CARTOGRAPHER_PLAN_ID');
  const supabase = getSupabaseAdminClient();
  const { data: existingSubscription, error: existingSubscriptionError } = await supabase
    .from('user_subscriptions')
    .select('id,user_id')
    .eq('provider_subscription_id', subscriptionId)
    .maybeSingle();

  if (existingSubscriptionError) {
    throw existingSubscriptionError;
  }

  if (!existingSubscription) {
    return 'ignored_unknown_subscription';
  }

  const paypalSubscription = await getPayPalSubscription(accessToken, subscriptionId);

  if (paypalSubscription.id !== subscriptionId) {
    return 'ignored_subscription_mismatch';
  }

  if (paypalSubscription.plan_id !== expectedPlanId) {
    return 'ignored_plan_mismatch';
  }

  const verifiedAt = new Date().toISOString();
  const status = getWebhookStatus(eventType, paypalSubscription.status);
  const { error: updateError } = await supabase
    .from('user_subscriptions')
    .update({
      provider: 'paypal',
      provider_plan_id: expectedPlanId,
      tier: 'cartographer',
      status,
      last_verified_at: verifiedAt,
      updated_at: verifiedAt,
    })
    .eq('provider_subscription_id', subscriptionId);

  if (updateError) {
    throw updateError;
  }

  return status === 'ACTIVE' ? 'updated_active' : 'updated_non_active';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Allow', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ received: false, error: 'Method not allowed.' });
  }

  try {
    const webhookHeaders = getRequiredWebhookHeaders(req);
    const event = parseWebhookEvent(req.body);

    if (!webhookHeaders || !event?.id || !event.event_type) {
      return res.status(400).json({ received: false, error: 'Invalid PayPal webhook request.' });
    }

    const accessToken = await getPayPalAccessToken();
    const verified = await verifyPayPalWebhookSignature(accessToken, webhookHeaders, event);

    if (!verified) {
      return res.status(401).json({ received: false, verified: false, error: 'PayPal webhook signature could not be verified.' });
    }

    if (await isWebhookEventAlreadyProcessed(event.id)) {
      return res.status(200).json({ received: true, verified: true, duplicate: true });
    }

    const subscriptionId = getSubscriptionId(event);
    const handledEvent = SUBSCRIPTION_EVENTS.has(event.event_type) || PAYMENT_EVENTS.has(event.event_type);
    let result = 'ignored_unhandled_event';

    if (handledEvent && subscriptionId) {
      result = await updateKnownSubscription(event.event_type, subscriptionId, accessToken);
    } else if (handledEvent) {
      result = 'ignored_missing_subscription_id';
    }

    await recordWebhookEvent(event.id, event.event_type, subscriptionId);
    return res.status(200).json({ received: true, verified: true, result });
  } catch (error) {
    console.error('PayPal webhook handling failed', error);
    return res.status(500).json({ received: false, error: 'PayPal webhook handling failed.' });
  }
}

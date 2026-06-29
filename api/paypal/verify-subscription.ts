import { createClient } from '@supabase/supabase-js';

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

type PayPalSubscriptionDetails = {
  id?: string;
  plan_id?: string;
  status?: string;
};

const PAYPAL_API_BASE_BY_ENV = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live: 'https://api-m.paypal.com',
};

function getHeaderValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getBearerToken(req: VercelRequest) {
  const authorization = getHeaderValue(req.headers.authorization ?? req.headers.Authorization);
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}

function getSubscriptionId(body: unknown) {
  if (typeof body === 'string') {
    try {
      return getSubscriptionId(JSON.parse(body));
    } catch {
      return undefined;
    }
  }

  if (!body || typeof body !== 'object') {
    return undefined;
  }

  const value = (body as { subscriptionID?: unknown; subscriptionId?: unknown }).subscriptionID ?? (body as { subscriptionId?: unknown }).subscriptionId;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

async function getPayPalAccessToken(baseUrl: string, clientId: string, clientSecret: string) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  if (!response.ok) {
    throw new Error('PayPal OAuth request failed.');
  }

  const payload = (await response.json()) as { access_token?: string };

  if (!payload.access_token) {
    throw new Error('PayPal OAuth response did not include an access token.');
  }

  return payload.access_token;
}

async function getPayPalSubscription(baseUrl: string, accessToken: string, subscriptionId: string) {
  const response = await fetch(`${baseUrl}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('PayPal subscription lookup failed.');
  }

  return (await response.json()) as PayPalSubscriptionDetails;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Allow', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ verified: false, error: 'Method not allowed.' });
  }

  try {
    const subscriptionId = getSubscriptionId(req.body);
    const userAccessToken = getBearerToken(req);

    if (!subscriptionId) {
      return res.status(400).json({ verified: false, error: 'Missing PayPal subscription ID.' });
    }

    if (!userAccessToken) {
      return res.status(401).json({ verified: false, error: 'Missing Supabase access token.' });
    }

    const supabaseUrl = getRequiredEnv('SUPABASE_URL');
    const supabaseServiceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const paypalClientId = getRequiredEnv('PAYPAL_CLIENT_ID');
    const paypalClientSecret = getRequiredEnv('PAYPAL_CLIENT_SECRET');
    const expectedPlanId = getRequiredEnv('PAYPAL_CARTOGRAPHER_PLAN_ID');
    const paypalEnv = process.env.PAYPAL_ENV === 'live' ? 'live' : 'sandbox';
    const paypalBaseUrl = PAYPAL_API_BASE_BY_ENV[paypalEnv];
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser(userAccessToken);

    if (userError || !userData.user) {
      return res.status(401).json({ verified: false, error: 'Invalid Supabase access token.' });
    }

    const paypalAccessToken = await getPayPalAccessToken(paypalBaseUrl, paypalClientId, paypalClientSecret);
    const subscription = await getPayPalSubscription(paypalBaseUrl, paypalAccessToken, subscriptionId);

    if (subscription.id !== subscriptionId) {
      return res.status(400).json({ verified: false, error: 'PayPal subscription ID mismatch.' });
    }

    if (subscription.plan_id !== expectedPlanId) {
      return res.status(400).json({
        verified: false,
        subscriptionStatus: subscription.status ?? 'UNKNOWN',
        granted: false,
        error: 'PayPal subscription plan does not match Cartographer.',
      });
    }

    const { data: existingSubscription, error: existingSubscriptionError } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('provider_subscription_id', subscriptionId)
      .maybeSingle();

    if (existingSubscriptionError) {
      throw existingSubscriptionError;
    }

    if (existingSubscription && existingSubscription.user_id !== userData.user.id) {
      return res.status(409).json({ verified: false, granted: false, error: 'PayPal subscription is already linked to another account.' });
    }

    const status = subscription.status ?? 'UNKNOWN';
    const granted = status === 'ACTIVE';
    const verifiedAt = new Date().toISOString();
    const { error: upsertError } = await supabase.from('user_subscriptions').upsert(
      {
        user_id: userData.user.id,
        provider: 'paypal',
        provider_subscription_id: subscriptionId,
        provider_plan_id: expectedPlanId,
        tier: 'cartographer',
        status,
        last_verified_at: verifiedAt,
        updated_at: verifiedAt,
      },
      { onConflict: 'provider_subscription_id' },
    );

    if (upsertError) {
      throw upsertError;
    }

    return res.status(200).json({
      verified: granted,
      subscriptionStatus: status,
      granted,
      tier: granted ? 'cartographer' : null,
    });
  } catch (error) {
    console.error('PayPal subscription verification failed', error);
    return res.status(500).json({ verified: false, granted: false, error: 'Subscription verification failed.' });
  }
}

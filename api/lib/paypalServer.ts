export type PayPalEnvironment = 'sandbox' | 'live';

export type PayPalSubscriptionDetails = {
  id?: string;
  plan_id?: string;
  status?: string;
};

export type PayPalWebhookVerificationHeaders = {
  transmissionId: string;
  transmissionTime: string;
  certUrl: string;
  authAlgo: string;
  transmissionSig: string;
};

const PAYPAL_API_BASE_BY_ENV: Record<PayPalEnvironment, string> = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live: 'https://api-m.paypal.com',
};

export function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export function getPayPalEnvironment() {
  return process.env.PAYPAL_ENV === 'live' ? 'live' : 'sandbox';
}

export function getPayPalApiBaseUrl() {
  return PAYPAL_API_BASE_BY_ENV[getPayPalEnvironment()];
}

export async function getPayPalAccessToken() {
  const clientId = getRequiredEnv('PAYPAL_CLIENT_ID');
  const clientSecret = getRequiredEnv('PAYPAL_CLIENT_SECRET');
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${getPayPalApiBaseUrl()}/v1/oauth2/token`, {
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

export async function getPayPalSubscription(accessToken: string, subscriptionId: string) {
  const response = await fetch(`${getPayPalApiBaseUrl()}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`, {
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

export async function verifyPayPalWebhookSignature(accessToken: string, headers: PayPalWebhookVerificationHeaders, webhookEvent: unknown) {
  const response = await fetch(`${getPayPalApiBaseUrl()}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: headers.authAlgo,
      cert_url: headers.certUrl,
      transmission_id: headers.transmissionId,
      transmission_sig: headers.transmissionSig,
      transmission_time: headers.transmissionTime,
      webhook_id: getRequiredEnv('PAYPAL_WEBHOOK_ID'),
      webhook_event: webhookEvent,
    }),
  });

  if (!response.ok) {
    throw new Error('PayPal webhook verification request failed.');
  }

  const payload = (await response.json()) as { verification_status?: string };
  return payload.verification_status === 'SUCCESS';
}

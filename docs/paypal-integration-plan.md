# PayPal Integration Plan

Dungeon Dossier uses PayPal for the Cartographer subscription test flow. Checkout remains disabled by default and is enabled only when the relevant environment variables are configured.

## Milestone 4B

- The frontend loads the PayPal JavaScript SDK dynamically.
- The Plans page renders the Cartographer subscription button only when checkout is enabled and configured.
- Signed-out users are asked to sign in before subscribing.
- Frontend approval alone does not grant Cartographer access.

## Milestone 4C

Milestone 4C adds immediate post-approval verification:

1. The PayPal approval callback sends the returned subscription ID to `/api/paypal/verify-subscription`.
2. The request includes the signed-in Supabase access token as `Authorization: Bearer <token>`.
3. The serverless API verifies the Supabase user from that token.
4. The serverless API uses server-only PayPal credentials to fetch subscription details from PayPal.
5. The API verifies that the PayPal plan ID matches the configured Cartographer plan and that the status is `ACTIVE`.
6. The API upserts `public.user_subscriptions` with provider `paypal`, tier `cartographer`, and the verified subscription status.
7. The frontend refetches subscription state from Supabase. Only `ACTIVE` Cartographer rows grant app access.

## Milestone 4D

Milestone 4D adds PayPal webhook handling for subscription status changes:

1. PayPal sends subscription events to `/api/paypal/webhook`.
2. The serverless API verifies the webhook signature with PayPal before trusting the event.
3. The API ignores duplicate webhook deliveries using `public.paypal_webhook_events`.
4. Subscription lifecycle events fetch the latest PayPal subscription details server-side before updating Supabase.
5. The API updates only existing `public.user_subscriptions` rows by `provider_subscription_id`; it does not map users by payer email.
6. `ACTIVE` status keeps Cartographer active. `CANCELLED`, `SUSPENDED`, `EXPIRED`, `PAYMENT_FAILED`, and other non-active statuses remove active Cartographer access because the frontend grants access only when status is `ACTIVE`.

Handled events:

- `BILLING.SUBSCRIPTION.CREATED`
- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.UPDATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.SUSPENDED`
- `BILLING.SUBSCRIPTION.EXPIRED`
- `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
- `PAYMENT.SALE.COMPLETED`
- `PAYMENT.SALE.REFUNDED`
- `PAYMENT.SALE.REVERSED`

Sale events are handled conservatively. They do not grant entitlement by themselves; when a subscription ID is available, the API fetches the related subscription details and updates the known subscription row safely.

## Required Environment Variables

Frontend:

```text
VITE_ENABLE_PAYPAL_CHECKOUT=true
VITE_PAYPAL_CLIENT_ID=<PayPal sandbox client ID>
VITE_PAYPAL_CARTOGRAPHER_PLAN_ID=<PayPal Cartographer plan ID>
VITE_PAYPAL_ENV=sandbox
```

Server-side only:

```text
PAYPAL_CLIENT_ID=<PayPal sandbox client ID>
PAYPAL_CLIENT_SECRET=<PayPal sandbox client secret>
PAYPAL_CARTOGRAPHER_PLAN_ID=<PayPal Cartographer plan ID>
PAYPAL_ENV=sandbox
PAYPAL_WEBHOOK_ID=<PayPal sandbox webhook ID>
SUPABASE_URL=<Supabase project URL>
SUPABASE_SERVICE_ROLE_KEY=<Supabase service role key>
```

Do not expose `PAYPAL_CLIENT_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` to frontend code.

## Supabase Setup

Apply the SQL in `supabase/migrations/20260625000000_user_subscriptions.sql` manually in Supabase if the project is not running migrations automatically.

The table enables RLS and allows authenticated users to select only their own subscription rows. Normal client-side insert, update, and delete policies are not added; server-side writes use the Supabase service-role key inside the Vercel API route.

Apply `supabase/migrations/20260629000000_paypal_webhook_events.sql` for webhook idempotency. It is service-role only and has no normal authenticated-user policies.

## PayPal Webhook Setup

In the PayPal Developer dashboard, create a sandbox webhook for the sandbox app and point it at:

```text
https://<deployed-or-preview-host>/api/paypal/webhook
```

Subscribe to the subscription events listed above. Localhost webhooks require a public tunnel or a deployed Vercel preview/live URL; PayPal cannot deliver webhooks directly to a private local port.

Use the sandbox webhook ID as `PAYPAL_WEBHOOK_ID` with sandbox credentials. For live launch, create a separate live webhook and use the live webhook ID with the live PayPal app/environment. Sandbox and live webhook IDs are not interchangeable.

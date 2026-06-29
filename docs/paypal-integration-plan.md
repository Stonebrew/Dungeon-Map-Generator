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

Webhook handling is intentionally left for a later milestone. Cancellations, failed payments, renewals, suspensions, and other status changes should be mirrored through PayPal webhooks before moving beyond sandbox testing.

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
SUPABASE_URL=<Supabase project URL>
SUPABASE_SERVICE_ROLE_KEY=<Supabase service role key>
```

Do not expose `PAYPAL_CLIENT_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` to frontend code.

## Supabase Setup

Apply the SQL in `supabase/migrations/20260625000000_user_subscriptions.sql` manually in Supabase if the project is not running migrations automatically.

The table enables RLS and allows authenticated users to select only their own subscription rows. Normal client-side insert, update, and delete policies are not added; server-side writes use the Supabase service-role key inside the Vercel API route.

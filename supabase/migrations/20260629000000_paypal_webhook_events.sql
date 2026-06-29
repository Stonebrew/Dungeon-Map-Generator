create table if not exists public.paypal_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'paypal' check (provider = 'paypal'),
  event_id text not null unique,
  event_type text not null,
  provider_subscription_id text null,
  processed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists paypal_webhook_events_subscription_idx
  on public.paypal_webhook_events (provider_subscription_id);

alter table public.paypal_webhook_events enable row level security;

grant usage on schema public to service_role;

grant select, insert, update, delete on public.paypal_webhook_events to service_role;

create extension if not exists pgcrypto;

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider = 'paypal'),
  provider_subscription_id text not null unique,
  provider_plan_id text not null,
  tier text not null check (tier = 'cartographer'),
  status text not null,
  current_period_start timestamptz null,
  current_period_end timestamptz null,
  last_verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_subscriptions_user_id_idx
  on public.user_subscriptions (user_id);

create index if not exists user_subscriptions_user_status_idx
  on public.user_subscriptions (user_id, provider, tier, status);

create or replace function public.set_user_subscriptions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_subscriptions_updated_at on public.user_subscriptions;

create trigger set_user_subscriptions_updated_at
before update on public.user_subscriptions
for each row
execute function public.set_user_subscriptions_updated_at();

alter table public.user_subscriptions enable row level security;

drop policy if exists "Users can read their own subscriptions" on public.user_subscriptions;

create policy "Users can read their own subscriptions"
on public.user_subscriptions
for select
to authenticated
using (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant usage on schema public to service_role;

grant select on public.user_subscriptions to authenticated;

grant select, insert, update, delete on public.user_subscriptions to service_role;

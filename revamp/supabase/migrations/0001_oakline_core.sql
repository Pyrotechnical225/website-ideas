-- Oakline Creator: accounts, cloud projects, subscriptions and AI allowances.
-- Run once in the Supabase SQL editor (or `supabase db push`).
-- Customers can only ever read/write their own rows. Plans, subscriptions and
-- AI usage are written only by the server (service role), never by the browser.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- plans
create table public.plan_limits (
  plan text primary key,
  luna_per_month int not null,
  sol_per_month int not null,
  max_projects int not null,
  max_pages int not null
);
insert into public.plan_limits values
  ('free', 25, 0, 3, 3),
  ('pro', 1000, 100, 25, 25);
alter table public.plan_limits enable row level security;
create policy "anyone can read plan limits" on public.plan_limits for select using (true);

-- ---------------------------------------------------------------- subscriptions (server-written)
create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null default 'none',          -- Stripe status: active, trialing, past_due, canceled, ...
  billing_interval text,                        -- month | year
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create policy "read own subscription" on public.subscriptions for select using (auth.uid() = user_id);

create table public.stripe_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);
alter table public.stripe_events enable row level security;  -- no policies: server only

create or replace function public.plan_for(p_user uuid) returns text
language sql stable security definer set search_path = public as $$
  select case when exists (
    select 1 from subscriptions s
    where s.user_id = p_user and s.status in ('active', 'trialing')
  ) then 'pro' else 'free' end;
$$;

-- ---------------------------------------------------------------- projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null default 'Untitled website' check (char_length(name) <= 80),
  brief text not null default '' check (char_length(brief) <= 4000),
  kind text not null default 'new' check (kind in ('new', 'existing')),
  data jsonb not null default '{}'::jsonb,       -- { pages: [{id,name,slug,html}], css }
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_size check (pg_column_size(data) <= 15 * 1024 * 1024)
);
create index projects_owner_updated on public.projects (owner, updated_at desc);
alter table public.projects enable row level security;
create policy "own projects: read" on public.projects for select using (auth.uid() = owner);
create policy "own projects: create" on public.projects for insert with check (auth.uid() = owner);
create policy "own projects: update" on public.projects for update using (auth.uid() = owner) with check (auth.uid() = owner);
create policy "own projects: delete" on public.projects for delete using (auth.uid() = owner);

-- Plan limits. Only new projects / added pages are blocked, so after a
-- downgrade existing work stays readable, editable and downloadable.
create or replace function public.enforce_project_limits() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  lim plan_limits;
  pages int := coalesce(jsonb_array_length(case when jsonb_typeof(new.data->'pages') = 'array' then new.data->'pages' end), 0);
  old_pages int := 0;
begin
  select * into lim from plan_limits where plan = plan_for(new.owner);
  if tg_op = 'INSERT' then
    perform pg_advisory_xact_lock(hashtext('projects:' || new.owner::text));
    if (select count(*) from projects where owner = new.owner) >= lim.max_projects then
      raise exception 'PROJECT_LIMIT: your plan allows % projects', lim.max_projects using errcode = 'P0001';
    end if;
  else
    new.owner := old.owner;  -- ownership can never change
    old_pages := coalesce(jsonb_array_length(case when jsonb_typeof(old.data->'pages') = 'array' then old.data->'pages' end), 0);
  end if;
  if pages > lim.max_pages and pages > old_pages then
    raise exception 'PAGE_LIMIT: your plan allows % pages per project', lim.max_pages using errcode = 'P0001';
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger projects_limits before insert or update on public.projects
  for each row execute function public.enforce_project_limits();

-- ---------------------------------------------------------------- AI allowances
-- One row per user, calendar month (UTC) and model. Monthly resets apply to
-- yearly subscribers too; nothing rolls over.
create table public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  model text not null check (model in ('luna', 'sol')),
  used int not null default 0 check (used >= 0),
  primary key (user_id, period_start, model)
);
alter table public.ai_usage enable row level security;
create policy "read own usage" on public.ai_usage for select using (auth.uid() = user_id);

create table public.ai_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  model text not null,
  period_start date not null,
  status text not null default 'reserved' check (status in ('reserved', 'completed', 'refunded')),
  input_tokens int,
  output_tokens int,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create index ai_requests_user on public.ai_requests (user_id, created_at desc);
alter table public.ai_requests enable row level security;  -- server only (keeps internal cost data private)

create or replace function public.month_start() returns date
language sql stable as $$ select date_trunc('month', now() at time zone 'utc')::date $$;

-- Atomically takes one request from the user's allowance. Returns the request id,
-- or raises ALLOWANCE_EXHAUSTED. Safe under concurrency (row lock on the counter).
create or replace function public.ai_reserve(p_user uuid, p_model text) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  lim int;
  period date := month_start();
  req uuid;
begin
  if p_model not in ('luna', 'sol') then raise exception 'UNKNOWN_MODEL' using errcode = 'P0001'; end if;
  select case when p_model = 'luna' then luna_per_month else sol_per_month end into lim
    from plan_limits where plan = plan_for(p_user);
  insert into ai_usage (user_id, period_start, model, used) values (p_user, period, p_model, 0)
    on conflict do nothing;
  update ai_usage set used = used + 1
    where user_id = p_user and period_start = period and model = p_model and used < lim;
  if not found then
    raise exception 'ALLOWANCE_EXHAUSTED' using errcode = 'P0001';
  end if;
  insert into ai_requests (user_id, model, period_start) values (p_user, p_model, period) returning id into req;
  return req;
end $$;

create or replace function public.ai_finish(p_request uuid, p_ok boolean, p_input_tokens int default null, p_output_tokens int default null)
returns void language plpgsql security definer set search_path = public as $$
declare r ai_requests;
begin
  update ai_requests set status = case when p_ok then 'completed' else 'refunded' end,
         input_tokens = p_input_tokens, output_tokens = p_output_tokens, finished_at = now()
    where id = p_request and status = 'reserved'
    returning * into r;
  if found and not p_ok then  -- give the request back; provider cost is still logged above
    update ai_usage set used = greatest(used - 1, 0)
      where user_id = r.user_id and period_start = r.period_start and model = r.model;
  end if;
end $$;

-- What the signed-in user sees: plan, limits and this month's balances.
create or replace function public.my_account() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'plan', plan_for(auth.uid()),
    'limits', (select row_to_json(l) from plan_limits l where l.plan = plan_for(auth.uid())),
    'used', json_build_object(
      'luna', coalesce((select used from ai_usage where user_id = auth.uid() and period_start = month_start() and model = 'luna'), 0),
      'sol',  coalesce((select used from ai_usage where user_id = auth.uid() and period_start = month_start() and model = 'sol'), 0)),
    'resets', (month_start() + interval '1 month')::date,
    'subscription', (select json_build_object('status', status, 'interval', billing_interval,
        'current_period_end', current_period_end, 'cancel_at_period_end', cancel_at_period_end)
      from subscriptions where user_id = auth.uid()),
    'projects', (select count(*) from projects where owner = auth.uid())
  ) where auth.uid() is not null;
$$;

-- Lock down: the browser may call my_account only; allowance functions are server-only.
revoke all on function public.ai_reserve(uuid, text) from public, anon, authenticated;
revoke all on function public.ai_finish(uuid, boolean, int, int) from public, anon, authenticated;
revoke all on function public.plan_for(uuid) from public, anon, authenticated;
revoke all on function public.my_account() from public, anon;
grant execute on function public.ai_reserve(uuid, text) to service_role;
grant execute on function public.ai_finish(uuid, boolean, int, int) to service_role;
grant execute on function public.plan_for(uuid) to service_role;
grant execute on function public.my_account() to authenticated;
revoke insert, update, delete on public.subscriptions, public.ai_usage, public.plan_limits from anon, authenticated;

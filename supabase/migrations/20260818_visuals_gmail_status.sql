-- Visual evidence, application status intelligence, and Gmail connection metadata.

alter table sample_opportunities add column if not exists pr_package_image_url text;
alter table sample_opportunities add column if not exists evidence_image_url text;
alter table sample_opportunities add column if not exists evidence_source_url text;
alter table sample_opportunities add column if not exists evidence_source_type text
  check (evidence_source_type in ('official_product','official_pr_package','official_campaign','brand_social','pr_agency','creator_platform','email_attachment','other'));
alter table sample_opportunities add column if not exists expected_contents text;
alter table sample_opportunities add column if not exists receipt_confidence text default 'unknown'
  check (receipt_confidence in ('exact_confirmed','high','medium','low','unknown'));
alter table sample_opportunities add column if not exists receipt_confidence_reason text;
alter table sample_opportunities add column if not exists last_status_event_at timestamptz;
alter table sample_opportunities add column if not exists last_status_event text;

create table if not exists application_events (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references sample_opportunities(id) on delete cascade,
  event_type text not null check (event_type in (
    'drafted','sent','delivered','viewed','clicked','replied','needs_info','approved','declined','waitlisted','campaign_full','address_requested','shipped','other'
  )),
  event_at timestamptz default now(),
  source text default 'manual',
  gmail_message_id text,
  gmail_thread_id text,
  details text,
  created_at timestamptz default now()
);
create index if not exists application_events_opportunity_idx on application_events(opportunity_id, event_at desc);

create table if not exists gmail_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null,
  google_sub text,
  encrypted_refresh_token text,
  access_token_expires_at timestamptz,
  scopes text[] default '{}',
  history_id text,
  watch_expiration timestamptz,
  connected_at timestamptz default now(),
  last_sync_at timestamptz,
  status text default 'connected' check (status in ('connected','needs_reauth','disconnected','error')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, email)
);

drop trigger if exists gmail_connections_updated_at on gmail_connections;
create trigger gmail_connections_updated_at before update on gmail_connections
  for each row execute function update_updated_at();

alter table application_events enable row level security;
alter table gmail_connections enable row level security;

drop policy if exists application_events_authenticated_full_access on application_events;
create policy application_events_authenticated_full_access on application_events
  for all to authenticated using (true) with check (true);

drop policy if exists gmail_connections_own_access on gmail_connections;
create policy gmail_connections_own_access on gmail_connections
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

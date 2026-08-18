-- ============================================================
-- Luxury Free Samples Hub — initial schema (Phase 1)
-- Single-tenant personal tool (Zoe Taylor only) — RLS is
-- "any authenticated user" rather than per-row user_id scoping.
-- Run this in the Supabase SQL Editor, then the seed migration.
-- ============================================================

create extension if not exists "pgcrypto";

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── creator_profile ─────────────────────────────────────────
create table if not exists creator_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  creator_handle text not null,
  email text not null,
  instagram_handle text,
  tiktok_handle text,
  location text,
  categories text[] default '{}',
  bio text,
  media_kit_url text,
  instagram_followers integer,
  tiktok_followers integer,
  shipping_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists creator_profile_updated_at on creator_profile;
create trigger creator_profile_updated_at before update on creator_profile
  for each row execute function update_updated_at();

-- ── pr_agencies ──────────────────────────────────────────────
create table if not exists pr_agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  city text,
  submission_process text,
  past_response text,
  relationship_stage text default 'target',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists pr_agencies_updated_at on pr_agencies;
create trigger pr_agencies_updated_at before update on pr_agencies
  for each row execute function update_updated_at();

-- ── pr_contacts ──────────────────────────────────────────────
create table if not exists pr_contacts (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references pr_agencies(id) on delete cascade,
  name text,
  email text,
  role text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists pr_contacts_updated_at on pr_contacts;
create trigger pr_contacts_updated_at before update on pr_contacts
  for each row execute function update_updated_at();

-- ── luxury_brands ────────────────────────────────────────────
create table if not exists luxury_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  luxury_tier text default 'luxury' check (luxury_tier in ('luxury', 'premium', 'unverified')),
  website text,
  instagram text,
  tiktok text,
  pr_agency_id uuid references pr_agencies(id) on delete set null,
  sampling_program boolean default false,
  relationship_stage text default 'target' check (relationship_stage in (
    'target', 'researched', 'contact_found', 'requested', 'responded',
    'first_sample', 'pr_list', 'repeat_gifting', 'priority_relationship'
  )),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists luxury_brands_updated_at on luxury_brands;
create trigger luxury_brands_updated_at before update on luxury_brands
  for each row execute function update_updated_at();

-- ── brand_contacts ───────────────────────────────────────────
create table if not exists brand_contacts (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references luxury_brands(id) on delete cascade,
  name text,
  email text,
  role text,
  verified boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists brand_contacts_updated_at on brand_contacts;
create trigger brand_contacts_updated_at before update on brand_contacts
  for each row execute function update_updated_at();

-- ── sample_opportunities ─────────────────────────────────────
create table if not exists sample_opportunities (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  brand_id uuid references luxury_brands(id) on delete set null,
  brand_logo_url text,
  product text not null,
  category text not null check (category in ('fragrance', 'beauty', 'fashion', 'accessories', 'home')),
  product_image_url text,
  estimated_value numeric,
  brand_tier text default 'luxury' check (brand_tier in ('luxury', 'premium', 'unverified')),
  offer_type text check (offer_type in (
    'official_free_sample', 'pr_sample', 'pr_mailer', 'creator_gifting',
    'product_seeding', 'no_obligation_gifting', 'launch_mailer', 'press_sample',
    'creator_sample', 'review_sample', 'event_gift', 'luxury_gift',
    'full_size_product', 'miniature', 'discovery_sample', 'fragrance_vial',
    'clothing_gift', 'home_product_gift'
  )),
  source text,
  official_website text,
  official_social text,
  application_link text,
  contact_name text,
  contact_email text,
  pr_agency text,
  date_found date default current_date,
  deadline date,
  requirements text,
  social_requirements text,
  posting_required boolean default false,
  posting_platform text,
  posting_count integer,
  posting_deadline date,
  posting_tags text,
  disclosure_type text check (disclosure_type in ('gifted', 'pr', 'brand_gift', 'ad')),

  shipping_responsibility text default 'unclear' check (shipping_responsibility in ('brand_covers', 'zoe_covers', 'unclear')),
  card_required boolean default false,
  payment_required boolean default false,
  purchase_required boolean default false,
  deposit_required boolean default false,
  gift_card_requested boolean default false,
  crypto_requested boolean default false,
  reimbursement_first boolean default false,
  membership_fee_required boolean default false,
  telegram_only boolean default false,
  whatsapp_only boolean default false,
  urgent_pressure_language boolean default false,
  suspicious_attachment boolean default false,
  requests_ssn_or_id boolean default false,
  requests_banking_early boolean default false,
  brand_verified boolean default false,

  verification_status text default 'unverified' check (verification_status in ('unverified', 'in_progress', 'verified')),
  safety_badge text default 'REVIEW' check (safety_badge in ('SAFE', 'REVIEW', 'HIGH_RISK', 'REJECTED')),
  safety_reasons text[] default '{}',
  opportunity_score numeric,

  status text not null default 'found' check (status in (
    'found', 'researching', 'verified', 'ready_to_request', 'request_sent',
    'waiting', 'approved', 'address_requested', 'address_sent', 'processing',
    'shipped', 'delivered', 'received', 'declined', 'rejected', 'scam'
  )),

  request_date date,
  approval_date date,
  shipment_date date,
  tracking_number text,
  delivery_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists sample_opportunities_status_idx on sample_opportunities (status);
create index if not exists sample_opportunities_date_found_idx on sample_opportunities (date_found);
create index if not exists sample_opportunities_category_idx on sample_opportunities (category);

drop trigger if exists sample_opportunities_updated_at on sample_opportunities;
create trigger sample_opportunities_updated_at before update on sample_opportunities
  for each row execute function update_updated_at();

-- ── sample_requests ──────────────────────────────────────────
create table if not exists sample_requests (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references sample_opportunities(id) on delete cascade,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  contact_name text,
  contact_email text,
  method text check (method in ('email', 'instagram_dm', 'tiktok', 'application', 'pr_portal')),
  subject text,
  message text,
  status text default 'draft' check (status in ('draft', 'sent', 'followed_up', 'responded', 'no_response', 'approved', 'declined')),
  date_sent date,
  follow_up_date date,
  response text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists sample_requests_opportunity_idx on sample_requests (opportunity_id);

drop trigger if exists sample_requests_updated_at on sample_requests;
create trigger sample_requests_updated_at before update on sample_requests
  for each row execute function update_updated_at();

-- ── conversations / conversation_messages (schema now, UI in Phase 2) ──
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references sample_opportunities(id) on delete cascade,
  brand_contact_id uuid references brand_contacts(id) on delete set null,
  subject text,
  status text default 'open',
  last_message_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists conversations_updated_at on conversations;
create trigger conversations_updated_at before update on conversations
  for each row execute function update_updated_at();

create table if not exists conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  direction text check (direction in ('outbound', 'inbound')),
  body text,
  sent_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists conversation_messages_conversation_idx on conversation_messages (conversation_id);

-- ── shipments (schema now, UI in Phase 2) ───────────────────
create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references sample_opportunities(id) on delete cascade,
  carrier text,
  tracking_number text,
  shipment_date date,
  expected_delivery date,
  delivery_status text default 'processing',
  received boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists shipments_updated_at on shipments;
create trigger shipments_updated_at before update on shipments
  for each row execute function update_updated_at();

-- ── received_products ────────────────────────────────────────
create table if not exists received_products (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references sample_opportunities(id) on delete set null,
  brand text not null,
  product text not null,
  category text check (category in ('fragrance', 'beauty', 'fashion', 'accessories', 'home')),
  retail_value numeric,
  date_received date default current_date,
  source text,
  pr_agency text,
  posting_required boolean default false,
  posted boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists received_products_date_idx on received_products (date_received);
create index if not exists received_products_category_idx on received_products (category);

drop trigger if exists received_products_updated_at on received_products;
create trigger received_products_updated_at before update on received_products
  for each row execute function update_updated_at();

-- ── wish_list ────────────────────────────────────────────────
create table if not exists wish_list (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  product text not null,
  category text check (category in ('fragrance', 'beauty', 'fashion', 'accessories', 'home')),
  retail_price numeric,
  product_url text,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  why_wanted text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists wish_list_updated_at on wish_list;
create trigger wish_list_updated_at before update on wish_list
  for each row execute function update_updated_at();

-- ── search_queries / search_runs (schema now, UI in Phase 3) ──
create table if not exists search_queries (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  category text,
  created_at timestamptz default now()
);

create table if not exists search_runs (
  id uuid primary key default gen_random_uuid(),
  run_date date default current_date,
  queries_run integer default 0,
  results_found integer default 0,
  verified integer default 0,
  rejected integer default 0,
  scam integer default 0,
  added integer default 0,
  notes text,
  created_at timestamptz default now()
);

-- ── verification_checks / risk_flags (schema now, Phase 2 UI) ──
create table if not exists verification_checks (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references sample_opportunities(id) on delete cascade,
  check_type text check (check_type in ('brand', 'contact', 'offer')),
  passed boolean,
  notes text,
  checked_at timestamptz default now()
);

create index if not exists verification_checks_opportunity_idx on verification_checks (opportunity_id);

create table if not exists risk_flags (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references sample_opportunities(id) on delete cascade,
  flag_type text not null,
  details text,
  created_at timestamptz default now()
);

create index if not exists risk_flags_opportunity_idx on risk_flags (opportunity_id);

-- ── notifications (schema now, Phase 3 UI) ──────────────────
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  body text,
  read boolean default false,
  related_opportunity_id uuid references sample_opportunities(id) on delete cascade,
  created_at timestamptz default now()
);

create index if not exists notifications_read_idx on notifications (read);

-- ── audit_logs (schema now, Phase 3 UI) ─────────────────────
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamptz default now()
);

create index if not exists audit_logs_entity_idx on audit_logs (entity_type, entity_id);

-- ============================================================
-- Row Level Security — single-tenant (Zoe only). Any authenticated
-- user gets full access; there is no per-row ownership because
-- there's exactly one user of this app.
-- ============================================================

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'creator_profile', 'luxury_brands', 'brand_contacts', 'pr_agencies',
      'pr_contacts', 'sample_opportunities', 'sample_requests', 'conversations',
      'conversation_messages', 'shipments', 'received_products', 'wish_list',
      'search_queries', 'search_runs', 'verification_checks', 'risk_flags',
      'notifications', 'audit_logs'
    ])
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_authenticated_full_access', t);
    execute format(
      'create policy %I on %I for all to authenticated using (true) with check (true)',
      t || '_authenticated_full_access', t
    );
  end loop;
end $$;

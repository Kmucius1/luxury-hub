create table if not exists creator_platform_accounts (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  account_url text,
  profile_url text,
  username text,
  email text,
  status text default 'active' check (status in ('active','needs_setup','paused','disconnected')),
  notes text,
  last_checked_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(platform)
);

drop trigger if exists creator_platform_accounts_updated_at on creator_platform_accounts;
create trigger creator_platform_accounts_updated_at before update on creator_platform_accounts
  for each row execute function update_updated_at();

alter table creator_platform_accounts enable row level security;
drop policy if exists creator_platform_accounts_authenticated_full_access on creator_platform_accounts;
create policy creator_platform_accounts_authenticated_full_access on creator_platform_accounts
  for all to authenticated using (true) with check (true);

insert into creator_platform_accounts (platform, account_url, status, notes)
values ('Fohr', 'https://app.fohr.co/', 'needs_setup', 'Unverified whether Zoe already has a Fohr account — confirm before treating as active. Fohr ambassador applications were checked live 2026-08-18 and were closed at that time.')
on conflict (platform) do update set account_url=excluded.account_url, notes=excluded.notes;

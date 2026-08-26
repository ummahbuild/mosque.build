
create type public.claim_status as enum (
  'pending','challenge_issued','verification_pending','verified',
  'admin_review','approved','rejected','revoked','disputed','expired'
);

create table public.mosque_claims (
  id uuid primary key default gen_random_uuid(),
  mosque_id uuid not null references public.mosques(id) on delete cascade,
  claimant_id uuid not null references public.profiles(id) on delete cascade,
  requested_role text not null default 'mosque_admin',
  claimed_domain text,
  status public.claim_status not null default 'pending',
  risk_score integer check (risk_score between 0 and 100),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.profiles(id)
);

create table public.mosque_claim_challenges (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.mosque_claims(id) on delete cascade,
  method text not null,
  domain text,
  token_hash text not null,
  challenge_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  verified_at timestamptz,
  attempt_count integer not null default 0,
  evidence jsonb not null default '{}'::jsonb
);

create table public.mosque_field_assertions (
  id uuid primary key default gen_random_uuid(),
  mosque_id uuid not null references public.mosques(id) on delete cascade,
  field_key text not null,
  value jsonb not null,
  source_id uuid references public.sources(id),
  source_kind text not null,
  authority_scope text,
  confidence smallint check (confidence between 0 and 100),
  observed_at timestamptz,
  verified_at timestamptz,
  superseded_at timestamptz,
  created_at timestamptz not null default now()
);

create index mosque_field_assertions_current_idx
  on public.mosque_field_assertions (mosque_id, field_key)
  where superseded_at is null;

alter table public.mosque_claims enable row level security;
alter table public.mosque_claim_challenges enable row level security;
alter table public.mosque_field_assertions enable row level security;


-- mosque.build canonical schema draft v9
-- Not yet a complete production migration set; establishes canonical boundaries.

create extension if not exists pgcrypto;
create extension if not exists postgis;

create type public.publish_status as enum ('draft','review','published','rejected','archived');
create type public.review_status as enum ('unreviewed','in_review','verified','rejected','stale');
create type public.member_status as enum ('invited','active','suspended','left');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text default 'en',
  created_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.member_status not null default 'active',
  created_at timestamptz not null default now(),
  primary key (organization_id,user_id)
);

create table public.mosques (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null,
  slug text,
  organization_id uuid references public.organizations(id),
  geom geography(point,4326),
  address jsonb not null default '{}'::jsonb,
  publish_status public.publish_status not null default 'draft',
  verification_status public.review_status not null default 'unreviewed',
  source_quality smallint check (source_quality between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(slug)
);

create index mosques_geom_gix on public.mosques using gist (geom);
create index mosques_name_idx on public.mosques using gin (to_tsvector('simple', canonical_name));

create table public.mosque_aliases (
  id uuid primary key default gen_random_uuid(),
  mosque_id uuid not null references public.mosques(id) on delete cascade,
  alias text not null,
  locale text,
  source_id uuid,
  unique(mosque_id,alias,locale)
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  name text not null,
  url text,
  publisher text,
  rights_status text,
  last_verified_at timestamptz,
  superseded_by uuid references public.sources(id),
  created_at timestamptz not null default now()
);

create table public.mosque_provider_links (
  id uuid primary key default gen_random_uuid(),
  mosque_id uuid not null references public.mosques(id) on delete cascade,
  provider text not null,
  provider_entity_id text not null,
  last_fetched_at timestamptz,
  raw_provenance jsonb not null default '{}'::jsonb,
  unique(provider,provider_entity_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  name text not null,
  project_type text not null,
  status text not null default 'idea',
  base_currency text not null default 'USD',
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  capability_set jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  primary key(project_id,user_id)
);

create table public.design_scenarios (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  parent_scenario_id uuid references public.design_scenarios(id),
  name text not null,
  status text not null default 'working',
  tags text[] not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.design_versions (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references public.design_scenarios(id) on delete cascade,
  version_no integer not null,
  geometry jsonb not null,
  program jsonb not null default '{}'::jsonb,
  assumptions jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique(scenario_id,version_no)
);

create table public.cost_estimates (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references public.design_scenarios(id),
  version_no integer not null,
  currency text not null,
  estimate_level text not null,
  assumptions jsonb not null,
  totals jsonb not null,
  fx_snapshot jsonb not null,
  source_summary jsonb not null,
  is_baseline boolean not null default false,
  created_at timestamptz not null default now(),
  unique(scenario_id,version_no)
);

create table public.requirements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  origin text not null,
  priority text,
  acceptance_metric text,
  verification_method text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  mosque_id uuid references public.mosques(id),
  project_id uuid references public.projects(id),
  asset_tag text,
  name text not null,
  system text,
  location jsonb not null default '{}'::jsonb,
  manufacturer text,
  model text,
  serial_number text,
  installed_at date,
  warranty_end date,
  maintenance_plan jsonb not null default '{}'::jsonb,
  retired_at date
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  project_id uuid,
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

-- RLS enabled on all client-facing tables.
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.mosques enable row level security;
alter table public.mosque_aliases enable row level security;
alter table public.sources enable row level security;
alter table public.mosque_provider_links enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.design_scenarios enable row level security;
alter table public.design_versions enable row level security;
alter table public.cost_estimates enable row level security;
alter table public.requirements enable row level security;
alter table public.assets enable row level security;
alter table public.audit_logs enable row level security;

-- Example helper. Production version should be SECURITY DEFINER only where
-- carefully reviewed; avoid broad bypass helpers.
create or replace function public.is_org_member(org uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;

create policy "published mosques are public"
on public.mosques for select
using (publish_status = 'published' or (organization_id is not null and public.is_org_member(organization_id)));

create policy "org projects visible to members"
on public.projects for select
using (public.is_org_member(organization_id));

create policy "project members view scenarios"
on public.design_scenarios for select
using (
  exists (
    select 1 from public.projects p
    where p.id = project_id and public.is_org_member(p.organization_id)
  )
);

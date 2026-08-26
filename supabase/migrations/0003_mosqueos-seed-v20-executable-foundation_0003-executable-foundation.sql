
-- v20 executable foundation draft
create extension if not exists pgcrypto;
create extension if not exists postgis;

create table if not exists public.project_sites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  geom geometry(Geometry,4326),
  local_origin jsonb,
  source_kind text,
  scan_version integer,
  created_at timestamptz not null default now()
);

create table if not exists public.design_objects (
  id uuid primary key default gen_random_uuid(),
  design_version_id uuid not null references public.design_versions(id) on delete cascade,
  stable_object_key text not null,
  kind text not null,
  parent_object_id uuid references public.design_objects(id),
  geometry jsonb not null,
  properties jsonb not null default '{}'::jsonb,
  classification jsonb not null default '{}'::jsonb,
  unique(design_version_id, stable_object_key)
);

create table if not exists public.takeoff_versions (
  id uuid primary key default gen_random_uuid(),
  design_version_id uuid not null references public.design_versions(id) on delete cascade,
  ruleset_version text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.takeoff_lines (
  id uuid primary key default gen_random_uuid(),
  takeoff_version_id uuid not null references public.takeoff_versions(id) on delete cascade,
  object_id uuid references public.design_objects(id),
  assembly_key text,
  quantity numeric not null,
  unit text not null,
  confidence text not null,
  source text not null
);

create table if not exists public.project_cart_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  scenario_id uuid references public.design_scenarios(id),
  design_object_key text,
  product_id text,
  generic_spec_key text,
  quantity numeric,
  unit text,
  technical_status text not null default 'provisional',
  commercial_status text not null default 'not_sourced',
  created_at timestamptz not null default now()
);

create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  package_name text not null,
  status text not null default 'draft',
  need_by date,
  created_at timestamptz not null default now()
);

create table if not exists public.rfq_items (
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  cart_item_id uuid not null references public.project_cart_items(id),
  primary key(rfq_id, cart_item_id)
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  vendor_id text not null,
  currency text not null,
  subtotal numeric,
  freight numeric,
  taxes_fees numeric,
  total numeric,
  valid_until date,
  lead_time_days integer,
  quote_document_path text,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

create table if not exists public.construction_activities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  wbs_code text not null,
  name text not null,
  baseline_start date,
  baseline_finish date,
  current_start date,
  current_finish date,
  progress_method text,
  percent_complete numeric check(percent_complete between 0 and 100),
  unique(project_id,wbs_code)
);

create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  activity_id uuid references public.construction_activities(id),
  template_key text,
  status text not null default 'planned',
  result text,
  evidence jsonb not null default '[]'::jsonb,
  inspected_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.domain_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  event_version integer not null default 1,
  aggregate_type text,
  aggregate_id text,
  payload jsonb not null,
  occurred_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.project_sites enable row level security;
alter table public.design_objects enable row level security;
alter table public.takeoff_versions enable row level security;
alter table public.takeoff_lines enable row level security;
alter table public.project_cart_items enable row level security;
alter table public.rfqs enable row level security;
alter table public.rfq_items enable row level security;
alter table public.quotes enable row level security;
alter table public.construction_activities enable row level security;
alter table public.inspections enable row level security;
alter table public.domain_events enable row level security;

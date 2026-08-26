
create table if not exists public.landscape_zones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  design_version_id uuid references public.design_versions(id),
  kind text not null,
  geometry jsonb not null,
  properties jsonb not null default '{}'::jsonb,
  status text not null default 'design',
  created_at timestamptz not null default now()
);

create table if not exists public.plant_palette_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  plant_key text not null,
  botanical_name text,
  common_name text,
  source_id uuid references public.sources(id),
  native_status text,
  climate_fit text,
  water_class text,
  maintenance_class text,
  safety_cautions jsonb not null default '{}'::jsonb,
  review_status text not null default 'candidate',
  unique(project_id,plant_key)
);

create table if not exists public.landscape_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  landscape_zone_id uuid references public.landscape_zones(id),
  asset_type text not null,
  plant_palette_entry_id uuid references public.plant_palette_entries(id),
  installed_at date,
  establishment_until date,
  condition text,
  maintenance_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.water_reuse_scenarios (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_type text not null,
  treatment_assumption jsonb,
  permitted_uses text[] not null default '{}',
  storage_liters numeric,
  demand_liters_per_day numeric,
  regulatory_status text not null default 'verify',
  professional_review_required boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.landscape_zones enable row level security;
alter table public.plant_palette_entries enable row level security;
alter table public.landscape_assets enable row level security;
alter table public.water_reuse_scenarios enable row level security;

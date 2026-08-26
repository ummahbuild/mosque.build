
create table if not exists public.engineering_assumptions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  discipline text not null,
  title text not null,
  value jsonb not null,
  unit text,
  basis text,
  source_id uuid references public.sources(id),
  confidence smallint check (confidence between 0 and 100),
  status text not null default 'proposed',
  owner_id uuid references public.profiles(id),
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  superseded_by uuid references public.engineering_assumptions(id),
  created_at timestamptz not null default now()
);

create table if not exists public.takeoff_rule_versions (
  id uuid primary key default gen_random_uuid(),
  ruleset_key text not null,
  version text not null,
  rules jsonb not null,
  created_at timestamptz not null default now(),
  unique(ruleset_key,version)
);

create table if not exists public.construction_packages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  code text not null,
  name text not null,
  scope jsonb not null default '{}'::jsonb,
  contractor_org_id uuid references public.organizations(id),
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  unique(project_id,code)
);

create table if not exists public.submittals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  package_id uuid references public.construction_packages(id),
  number text not null,
  title text not null,
  revision integer not null default 1,
  status text not null default 'submitted',
  product_ids text[] not null default '{}',
  object_keys text[] not null default '{}',
  reviewer_id uuid references public.profiles(id),
  due_at timestamptz,
  responded_at timestamptz,
  response text,
  unique(project_id,number,revision)
);

create table if not exists public.daily_labor (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  work_date date not null,
  trade text not null,
  crew_count integer not null default 0,
  labor_hours numeric not null default 0,
  activity_id uuid references public.construction_activities(id),
  source text not null default 'field_report',
  created_at timestamptz not null default now()
);

create table if not exists public.commissioning_requirements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  system text not null,
  requirement text not null,
  object_keys text[] not null default '{}',
  status text not null default 'planned',
  evidence jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.engineering_assumptions enable row level security;
alter table public.takeoff_rule_versions enable row level security;
alter table public.construction_packages enable row level security;
alter table public.submittals enable row level security;
alter table public.daily_labor enable row level security;
alter table public.commissioning_requirements enable row level security;

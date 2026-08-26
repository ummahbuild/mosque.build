
create table if not exists public.engineering_issues (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  discipline text not null,
  title text not null,
  status text not null default 'open',
  severity text not null default 'normal',
  object_keys text[] not null default '{}',
  assumption_ids text[] not null default '{}',
  professional_review_required boolean not null default false,
  cost_impact numeric,
  time_impact_days integer,
  created_at timestamptz not null default now()
);

create table if not exists public.local_sourcing_options (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  cart_item_id uuid references public.project_cart_items(id) on delete cascade,
  vendor_id text,
  product_id text,
  locality jsonb not null,
  technical_fit text not null default 'unknown',
  landed_cost numeric,
  currency text,
  lead_time_days integer,
  repairability_score numeric,
  local_value_score numeric,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.method_statements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  package_name text not null,
  template_key text,
  revision integer not null default 1,
  status text not null default 'draft',
  content jsonb not null default '{}'::jsonb,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.engineering_issues enable row level security;
alter table public.local_sourcing_options enable row level security;
alter table public.method_statements enable row level security;

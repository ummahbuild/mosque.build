
-- V25 RLS policy draft; assumes helper functions/project membership tables exist.
-- Replace helper names with canonical repo functions before migration.

create or replace function public.can_read_project(p_project uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists (
    select 1 from public.project_members pm
    where pm.project_id = p_project and pm.user_id = auth.uid()
  );
$$;

create or replace function public.can_edit_project(p_project uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select exists (
    select 1 from public.project_members pm
    where pm.project_id = p_project
      and pm.user_id = auth.uid()
      and pm.role in ('project_manager','project_editor','org_admin')
  );
$$;

drop policy if exists "read engineering assumptions" on public.engineering_assumptions;
create policy "read engineering assumptions"
on public.engineering_assumptions for select
using (public.can_read_project(project_id));

drop policy if exists "edit engineering assumptions" on public.engineering_assumptions;
create policy "edit engineering assumptions"
on public.engineering_assumptions for all
using (public.can_edit_project(project_id))
with check (public.can_edit_project(project_id));

drop policy if exists "read construction packages" on public.construction_packages;
create policy "read construction packages"
on public.construction_packages for select
using (public.can_read_project(project_id));

drop policy if exists "edit construction packages" on public.construction_packages;
create policy "edit construction packages"
on public.construction_packages for all
using (public.can_edit_project(project_id))
with check (public.can_edit_project(project_id));

drop policy if exists "read landscape zones" on public.landscape_zones;
create policy "read landscape zones"
on public.landscape_zones for select
using (public.can_read_project(project_id));

drop policy if exists "edit landscape zones" on public.landscape_zones;
create policy "edit landscape zones"
on public.landscape_zones for all
using (public.can_edit_project(project_id))
with check (public.can_edit_project(project_id));

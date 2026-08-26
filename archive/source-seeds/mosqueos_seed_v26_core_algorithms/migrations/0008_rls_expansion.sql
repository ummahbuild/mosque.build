
-- V26 RLS policy/test-oriented draft.
-- These policies depend on canonical can_read_project/can_edit_project helpers from v25.

drop policy if exists "read submittals" on public.submittals;
create policy "read submittals"
on public.submittals for select
using (public.can_read_project(project_id));

drop policy if exists "edit submittals" on public.submittals;
create policy "edit submittals"
on public.submittals for all
using (public.can_edit_project(project_id))
with check (public.can_edit_project(project_id));

drop policy if exists "read commissioning requirements" on public.commissioning_requirements;
create policy "read commissioning requirements"
on public.commissioning_requirements for select
using (public.can_read_project(project_id));

drop policy if exists "edit commissioning requirements" on public.commissioning_requirements;
create policy "edit commissioning requirements"
on public.commissioning_requirements for all
using (public.can_edit_project(project_id))
with check (public.can_edit_project(project_id));

-- Domain events should not accept direct anonymous/authenticated client inserts.
revoke insert, update, delete on public.domain_events from anon, authenticated;

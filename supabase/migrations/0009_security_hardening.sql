-- Harden helper-function privileges before any hosted rollout.
-- RLS remains mandatory; these grants do not create an authentication system.

revoke all on function public.can_read_project(uuid) from public;
revoke all on function public.can_edit_project(uuid) from public;
grant execute on function public.can_read_project(uuid) to authenticated;
grant execute on function public.can_edit_project(uuid) to authenticated;

-- Anonymous clients must not call membership helpers or mutate project-domain events.
revoke execute on function public.can_read_project(uuid) from anon;
revoke execute on function public.can_edit_project(uuid) from anon;
revoke insert, update, delete on public.domain_events from anon, authenticated;

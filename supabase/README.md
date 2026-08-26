# Supabase

The migration directory consolidates SQL found across historical implementation seeds in deterministic order for review.

**Do not blindly apply all migrations to production.** Some earlier files are drafts/expansions. Before first deployment:
1. create a clean canonical baseline migration,
2. diff/merge overlapping schema definitions,
3. run RLS matrix tests,
4. run destructive-migration review,
5. seed only factual/demo data explicitly labeled for its purpose.

Target runtime assumptions:
- Postgres managed by Supabase or portable PostgreSQL-compatible deployment
- RLS enabled for user/project tenant tables
- service-role keys server-side only

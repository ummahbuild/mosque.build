# PR reconciliation — 17 November 2026

## PR #5: service-worker cache isolation

Status: executable; automated checks passed locally. Device-specific installed-app review remains separate.

The original cache cleanup correction was already on main. Reconciled the original branch with main without reverting later security or application work, and added these related fixes:

- Limit reads as well as deletion to this app's current cache.
- Preserve real HTTP error responses instead of displaying stale successful pages.
- Return an explicit 503 when offline fallback content is missing or cache storage is blocked.
- Keep successful asset downloads usable when cache writes exceed quota.
- Keep image/font downloads usable when cache access is blocked.
- Require an offline fallback before a replacement worker can install.
- Avoid storing redirected install or asset responses.
- Keep navigations out of runtime cache and activation behind the explicit update action.

Verification: ten executed worker lifecycle/network/cache regression tests; full suite 826 passed, one skipped; repository validation, privacy scan and production build passed. Build includes TypeScript checking. No separate lint script exists. No schema, shared project data, external factual records or professional calculations changed, so RLS/provenance/professional gates are not applicable. Installed mobile-device offline/update behavior is not certified by these Node lifecycle tests.

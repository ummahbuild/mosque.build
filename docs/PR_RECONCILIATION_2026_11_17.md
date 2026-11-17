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

## PR #28: preserve recovery and expose the sample-plan comparison

Status: executable; conceptual geometry only, never professional approval.

Retained main's canonical `project-draft.ts` recovery implementation and behavioral tests. The PR's older permissive validator and automatic-import wizard changes were superseded; they must not overwrite enum/schema checks, exact-original backups, per-field concept review or cross-tab protection.

Integrated the remaining concept-to-CAD preview into the landing concept review. An expandable comparison shows requested indicative prayer-zone area, the optional sample's measured closed-boundary area, the direction/size of any mismatch, and unresolved room dimensions. It links directly to the floor-plan editor without loading the sample or changing saved drawings. Equal rounded areas explicitly do not establish capacity or compliance.

Five executed comparison tests cover mismatch, unknown/invalid attendance, smaller briefs, rounded matches, unresolved spaces and input immutability. Existing recovery tests continue to cover corrupted/legacy drafts, failed backups and stale-tab writes. Full suite: 831 passed, one skipped. No RLS/shared-data changes; dimensions remain conceptual and require qualified review. Accessibility/mobile/browser checks are recorded below.

## Dependency patch

Updated the pinned Next.js dependency and its lockfile from 16.4.1 to 16.4.5. Verified against the [Next.js advisory](https://github.com/vercel/next.js/security/advisories/GHSA-mfr8-8qww-v76h), observed 2026-11-17 (primary maintainer source; high confidence for affected/patched versions). The repository does not currently contain `unstable_cache` or `use cache` call sites, so this is dependency remediation, not evidence of an exploited leak. After updating, `pnpm --dir apps/web audit --audit-level moderate` reports no known vulnerabilities. Dependency audit results are time-specific.

## Browser and final release checks

- Production build on Next.js 16.4.5 passed, including TypeScript checking.
- Local browser: online 404 retained the not-found page; after stopping the server, an uncached route displayed the offline page.
- Concept review: 450 worshippers produced an indicative 563 m² versus the 64 m² sample, with a 499 m² difference and two unresolved support spaces.
- Enter opened the comparison disclosure; its summary had a visible focus outline.
- No horizontal overflow at 390 × 844 or 1440 × 900.
- The editor link reached `/design#cad-authoring-title`; the drawing remained revision 0 with no walls/openings and no saved model.
- No browser console warnings/errors in those checked flows.
- Physical installed-device testing, native/web parity and independent professional design review remain outside this verification. No construction-readiness claims are made.

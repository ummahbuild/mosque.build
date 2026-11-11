# Project action desk and safe local saves — 2026-11-11

Status: `executable`, device-local. This release extends [project planning](53_PROJECT_PLANNING_100.md) and [connected project actions](70_CONNECTED_PROJECT_ACTIONS_100.md). It does not certify engineering, approvals, religious content or construction. Deployment is a software release, not a change to those review gates.

## Implemented improvements

1. All 50 workflow actions are reachable; the previous 24-result truncation is removed.
2. Twelve-item pagination reports the current page and full result count.
3. Search matches work-area descriptions, responsible roles and notes, ignoring case and outer whitespace.
4. Deadline sorting puts undated work last.
5. Priority sorting supports critical, high, normal and later work.
6. Alphabetical sorting makes known work areas easy to locate.
7. An overdue view excludes closed and deferred work.
8. A seven-day view includes work due today.
9. An unassigned view exposes active work without an owner role.
10. A pinned view preserves the team's chosen priorities.
11. Closed actions remain discoverable through their own view.
12. Deferred actions remain discoverable through their own view.
13. Summary metrics open their corresponding filtered views.
14. Clear-filter and empty-result recovery controls restore the full list.
15. A stable editor keeps an action in place while list ordering changes.
16. Explicit Save and Cancel separate unsaved edits from stored records.
17. Review and closure require a responsible role and an evidence/outcome note.
18. Review additionally requires a target date and upstream record presence; presence is explicitly not verification.
19. Target dates reject impossible calendar dates, including non-leap-year February 29.
20. Notes have a 2,000-character bound and visible counter.
21. Strict schema validation pauses unsupported action records and offers the original download.
22. Compare-before-write rejects stale tab saves instead of overwriting newer records.
23. Storage failures retain the editable working copy and expose download/reload recovery.
24. Undo restores the previous saved action plan and checks for intervening tab changes.
25. Action backups use the existing restorable project-package format.
26. CSV export includes every filtered result, escapes quotes/newlines and neutralizes formula-leading cells.
27. Missing dependencies link to their source workspaces.
28. Unsaved edits trigger a leave-page warning; workspace links and action switches ask before discarding them.
29. Selecting an action moves keyboard focus to the editor heading; controls retain visible focus states and 44px targets.
30. Mobile places the editor before the list; desktop constrains long sticky editors to the viewport with internal scrolling.
31. My Project validates the brief before rendering array fields and routes malformed briefs to recovery.
32. First-plan completion deduplicates restored IDs, blocks malformed progress and only updates after storage succeeds.
33. Empty, scalar, oversized and malformed upstream records no longer satisfy workflow prerequisites.
34. Project-package preview rejects malformed action-plan sections before restore.
35. Service-worker activation removes only obsolete mosque.build shell caches, preserving unrelated caches on the origin.
36. First service-worker installation no longer reloads an already open form.
37. Review date fields stack on constrained tablet cards, fixing verified horizontal overflow.
38. Schedule editor fields shrink and stack at the tablet breakpoint, fixing a second verified overflow source.
39. Next.js is pinned to 16.4.1 to address the advisories reported against the former 16.2.11 installation.
40. Sharp and its override are pinned to 0.35.5, which includes the upstream image-library security patches.
41. A source-map-js override pins the transitive dependency to its patched 1.2.2 release.
42. CI audits the locked web dependency graph and fails on high or critical advisories.

The release also includes the previously implemented [draft recovery, concept import and safe backup fixes](ISSUE_BUGFIX_REVIEW_2026_11_11.md).

## Acceptance and verification

- Unit/security: `tests/action-desk.test.mjs` covers schema bounds, duplicate/unknown identifiers, invalid dates, all 50 actions, filters/sorts, review gates, stale writes, quota failures, undo, CSV escaping, invalid upstream records and cache ownership. Existing draft recovery, concept import and package rollback suites cover the bundled fixes.
- Integration: browser save → reload retained owner, date, note, pin and status. Cancel reverted unsaved priority. Save → Undo restored the prior priority. Two tabs reproduced a stale-write rejection; reloading retained the newer tab's value. JSON and CSV downloaded through the real controls and their contents were inspected.
- Accessibility: labeled native fields, live feedback, explanation linked to the disabled Save control, heading focus on selection and visible focus styling. Browser tested at 320, 360, 390, 430, 768, 1024 and 1280px; the final overflow fixes were rechecked at 320, 390, 768, 1024 and 1280px. No console warnings/errors in the exercised local flow.
- Full repository suite: 583 tests, 582 passed, one optional external IFC-parser test skipped. Repository validation and privacy scan passed. Production build/typecheck and hosted release checks are recorded in the delivery response.
- RLS: no shared persistence, new API or project/member database changes. These controls are device-local, not cross-user access control. Existing RLS gates remain required for future shared project storage.
- Provenance: no new external factual records, prices, permits or religious claims. Existing source/review boundaries retained.
- Dependency evidence, observed 2026-11-11: npm audit identified the affected installed versions; published patch ranges were checked against [Next.js GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw), [Sharp GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) and [source-map-js GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). These are vendor/advisory records, not a claim of an independent penetration test. No third-party content was copied into the product.
- Limits: responsive browser testing is not physical iOS/Android or installed standalone testing. Assistive-technology review, real-device install/update/offline testing and professional review of regulated outputs remain open. Compare-before-write is not an atomic cross-tab database transaction. Working-copy exports may contain unfinished fields or private notes and must be reviewed before restoration/sharing.

## Next development slices

- Replace read/write localStorage checks with a transactional persistence layer before supporting concurrent collaborative editing.
- Extend explicit-save, strict recovery and conflict handling to the remaining older planners.
- Add real-device install/update/offline and screen-reader runs to the review matrix in GitHub issues #22, #26 and #30.
- Continue #25 draft recovery coverage and #15 per-field concept provenance without presenting these broader issues as closed.
- Add review-aware action-to-schedule promotion with an explicit field preview, dependency mapping and reversible creation; do not silently overwrite either plan.

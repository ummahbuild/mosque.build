# Schedule persistence, dependency and planning fixes

Status: **executable**. Continues the saved-record recovery work associated with [#25](https://github.com/ummahbuild/mosque.build/issues/25) and mobile QA in [#22](https://github.com/ummahbuild/mosque.build/issues/22), [#26](https://github.com/ummahbuild/mosque.build/issues/26), [#30](https://github.com/ummahbuild/mosque.build/issues/30). Extracting schedule styles is a limited contribution to [#23](https://github.com/ummahbuild/mosque.build/issues/23), not completion of its CSS audit.

## Changes

1. Opening the schedule no longer writes an example into browser storage.
2. Empty and example schedules require explicit creation; example durations are identified as placeholders.
3. Unreadable or unsupported saved schedules remain untouched instead of being replaced with defaults.
4. Recovery offers the exact original download, retry and project recovery link.
5. Storage-read failures are distinct from missing records and cannot authorize overwrite.
6. Saves compare the current raw record with the loaded snapshot before writing.
7. Cross-tab and same-page tool changes warn the editor and disable stale editing until reload.
8. Failed saves retain a visible unsaved working copy with download/retry and a browser-leave warning.
9. Baseline restoration uses the same guarded writer and validates the generated working schedule.
10. Baseline and planning views respond to cross-tab changes; removed/unreadable working schedules clear the displayed source.
11. Planning views no longer substitute a default schedule for absent or unreadable saved work.
12. The progress slider uses the same prerequisite gate as status transitions.
13. A completion record needs valid dates, a name, role, evidence and 100% progress before it unblocks downstream work.
14. Transitive prerequisite gaps remain blockers even when an intermediate activity claims completion.
15. Dependency checks memoize shared paths, avoiding exponential traversal of dense graphs.
16. New cyclic, self and missing-activity dependencies are rejected without changing saved data.
17. Completion sets progress to 100 only after prerequisites and required fields pass.
18. Reducing completed progress or removing completion evidence reopens the activity and reports that change.
19. Returning to not-started resets reported progress to zero.
20. Completion and review summary counts exclude incomplete records; they remain user-entered planning signals, never verified progress.
21. Duplicate/blank task IDs, duplicate dependencies, non-finite progress and oversized text are rejected by the saved-state parser.
22. Strict calendar validation rejects normalized impossible dates; empty task dates remain editable drafts with zero calculated duration.
23. Undated or reversed activities do not create NaN/negative timeline geometry or false overdue counts.
24. Project bounds use valid dates, and project finish uses the latest date across every phase rather than the last phase in array order.
25. Invalid/empty date arithmetic returns an unknown result instead of throwing; look-ahead excludes undated tasks.
26. A 30-day look-ahead includes its start date once rather than returning 31 days.
27. Non-finite/fractional scenario shifts cannot generate invalid dates.
28. Activity creation stops at the same 200-activity limit used by restore validation.
29. Removal has an undo action that restores the activity and its dependent references, until the next edit/reload.
30. Empty schedules and filtered results explain what happened and offer a useful action. Adding an activity resets the filter so it is visible.
31. Schedule controls have bounded text, visible focus, 44px dependency targets and a responsive editor. The removal action does not wrap inside a narrow header.
32. Downloads delay URL revocation so the browser can begin reading the file.

## Test gates and evidence

- Unit/integration: 40 new executable tests cover storage recovery, quota/stale writes, parser limits, completion prerequisites, cycles, dense graphs, calendar bounds and look-ahead behavior. The planning tests now execute the actual schedule dependency instead of substituting a simplified mock.
- Full suite: **817 tests; 816 passed; one existing optional external IFC-parser test skipped**.
- Production build and TypeScript passed after adding explicit validation at the baseline-to-schedule handoff. Final CSS refinement was rebuilt before release.
- Repository validation and privacy scan passed; no lint command is configured. Diff whitespace check passed.
- Browser testing used synthetic records on isolated `127.0.0.1:3324`. A first visit showed zero saved sections; explicit example creation produced the first schedule.
- Browser verified slider dependency rejection, completion with role/evidence, cyclic dependency rejection, reopening after reduced progress, remove/undo, empty status filters and stable planning after clearing a date input.
- Two tabs: the first editor detected the second tab's newer activity name, disabled stale editing and reloaded the newer record successfully.
- A deliberately unreadable schedule imported through the project-package UI remained protected after reload. The original download matched the saved JSON string exactly. A repaired package restored the functional editor.
- Recovery widths: 320, 390, 768 and 1440 px. Restored editor widths: 320, 360, 390, 430, 768, 1024 and 1440 px. Document widths matched viewport widths, and no editor input extended outside the viewport. The wide timeline remains an intentional internally scrollable region.
- No console warnings/errors observed in the tested browser flows. Screenshot retained locally at `/tmp/mosque-build-schedule-editor-mobile.jpg`.
- Accessibility: native inputs, pressed activity selection, focus styles, named scrolling region and save/error status announcements checked. Physical iOS/Android keyboards, installed standalone mode and screen-reader certification remain open.
- Security/RLS: local-only persistence; no API/database/auth changes. RLS remains mandatory before shared project/member storage. Compare-before-write is not an atomic cross-tab database transaction.
- Provenance/human review: no new external laws, costs, religious or engineering facts. Dates, evidence references and completion are unverified project-team records. Professional, contract and authority review gates are unchanged.

## Remaining scope

Other planning registers still have their own persistence and schema behavior; this does not certify all app storage paths. Legacy semantic gaps are visible and do not establish feasibility, approval, construction progress or payment entitlement. Recovery files need manual repair or a valid project package; the application does not silently infer a repair. Undo removal is session-local and not an unlimited revision archive. Broader GitHub issues remain open.

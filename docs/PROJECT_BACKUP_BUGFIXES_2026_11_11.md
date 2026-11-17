# Project backup, restore and handoff fixes

Status: **executable**. Follow-up to [#25](https://github.com/ummahbuild/mosque.build/issues/25) for non-destructive recovery and [#22](https://github.com/ummahbuild/mosque.build/issues/22), [#26](https://github.com/ummahbuild/mosque.build/issues/26), [#30](https://github.com/ummahbuild/mosque.build/issues/30) for mobile interaction QA. The backup component CSS extraction is a small part of [#23](https://github.com/ummahbuild/mosque.build/issues/23); it does not complete that issue.

## Verified problems and changes

- Export no longer silently skips malformed or empty-string saved records. It identifies the affected section and stops without writing to storage.
- Unsupported nested shapes and non-finite numbers stop export rather than becoming incomplete or altered JSON.
- The same compact JSON serialization and UTF-8 2 MB limit govern package export and import. Oversized exports offer an original-record archive instead of an unusable package.
- Impossible calendar dates are rejected, including normalized February/April overflow dates. Valid fractional-second UTC dates remain accepted.
- Full local backup is the default; the former “share-safe” option is labeled “Brief-redacted copy.” Only selected brief fields are redacted. Other sections and project names may contain personal information.
- The existing serialized `share-safe` value remains accepted for compatibility; the UI and import warning explain its limited meaning.
- Original-record downloads preserve exact saved strings, including malformed records. They are clearly labeled private recovery archives, not ready-to-import packages.
- Saved-section counts read record presence without parsing and silently dropping damaged entries.
- Storage-unavailable and genuinely empty export states have distinct explanations.
- Restore previews snapshot the included target records. Changes, additions or deletion of those targets after review block replacement before any write. Changes in unrelated sections do not block a partial restore.
- Snapshot reads all complete before any write. Existing best-effort rollback and explicit incomplete-recovery errors remain covered.
- The preview lists only included sections, labels Add/Replace, explains that absent sections stay untouched, and warns about redacted blank fields replacing the brief.
- A pre-replacement archive can download exactly the originals seen at review time.
- Import requests use a generation token so a superseded read cannot install an older preview or error. Unmount invalidates in-flight reads.
- Restore has a synchronous duplicate-action guard; controls disable while successful restoration reloads the page.
- The review receives keyboard focus; Cancel returns focus to Choose project package. Controls wrap, preserve visible focus and remain at least 44 px tall.
- Long filenames and section names wrap instead of expanding the page. Backup styles now live with the component instead of in globals.css.
- Handoff packets contain only the sections listed for the chosen recipient, rather than the whole project.
- Missing workflow signals no longer count as included handoff records.
- Handoff export handles storage/validation errors and delays object-URL cleanup so the download can begin. Privacy copy no longer promises a share-safe packet.

## Verification

- Unit/integration: 31 new executable regression cases across `tests/project-package.test.mjs` and `tests/project-handoff-behavior.test.mjs`. All five recipient profiles checked against their allowed storage keys. Existing rollback, prototype-key and depth limits retained.
- Full suite: **777 tests; 776 passed; one existing optional external IFC-parser test skipped**.
- `pnpm web:build`: passed, including TypeScript and 101 static pages.
- `pnpm validate`: passed, 63 frames / 6315 normalized features / 20 public routes.
- `pnpm privacy:scan`: passed. `git diff --check`: passed. No lint command exists in this repository.
- Browser integration used only synthetic records on isolated `127.0.0.1:3323`: actual file chooser, Add/Replace review, explicit restore, reload, package download and byte/content inspection.
- Two tabs: a newer restore changed the target brief; the older preview was rejected and an exported package confirmed the newer brief survived. The originals archive retained the exact earlier strings.
- Invalid JSON and a file above 2 MB produced visible errors. Cancel returned focus; importing placed focus on the named preview.
- Long-filename preview checked at 320, 360, 390, 430, 768, 1024 and 1440 px. Document width matched each viewport; reviewed action heights were 46.5–63 px and stayed within the viewport.
- A real design-team download contained only the brief, excluding the saved schedule and pattern shortlist.
- Browser warnings/errors: none during these flows. Mobile screenshot retained locally at `/tmp/mosque-build-backup-review-mobile.jpg`.

## Boundaries and remaining gates

This is browser-local storage, not an atomic collaborative database. Compare-before-write prevents normal stale-preview overwrites; simultaneous writes across browser contexts cannot be given database transaction guarantees. Rollback can still fail if storage becomes unavailable, and reports that failure explicitly.

Recovery archives contain supported saved records only; they exclude unsaved edits, preferences and recovery slots. They deliberately preserve private content and require manual repair/conversion before package import. They are neither anonymized nor encrypted. No automatic deletion, upload, cloud persistence or new authorization path is introduced.

Only the existing brief and action-plan semantic validators run in the import UI; other workspace sections retain generic JSON safety validation. Full per-module migration and semantic restore validation remain open. Export size handling does not establish that every historical module schema is valid.

Accessibility/browser checks are not physical iOS/Android keyboard, installed standalone or screen-reader certification. Those issue-level gates remain open. No new permit, price, religious, engineering or vendor assertions were introduced; no external provenance changes. RLS tests are not applicable to this local-only change, and remain mandatory before shared project persistence. Existing professional/authority review boundaries are unchanged.

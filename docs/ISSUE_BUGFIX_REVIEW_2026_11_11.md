# Saved-brief and concept-import bug fixes — 2026-11-11

Status: **executable**. This is a tested local-workflow improvement, not a claim that the whole product is production-ready.

## GitHub issue coverage

| Issue | Changes | Remaining scope |
| --- | --- | --- |
| [#25 — draft validation and recovery](https://github.com/ummahbuild/mosque.build/issues/25) | Validate saved versions, enums, strings and arrays before editing. Preserve malformed originals, pause autosave, offer original download and explicit replacement. Back up before replacement and detect stale-tab writes. Resume and header routing use the same validator. | Device-level Safari/Android testing; all other workspace schemas remain outside this validator. |
| [#15 — reviewed concept import](https://github.com/ummahbuild/mosque.build/issues/15) | Nothing preselected; current/proposed values per field; explicit acceptance; original concept visible; existing needs preserved; style/storeys stored structurally; budget and currency reviewed together. | Per-field evidence spans and calibrated extraction confidence are not implemented. |
| [#20 — parser ambiguity](https://github.com/ummahbuild/mosque.build/issues/20) | Avoid small/mall substring error; distinguish musalla from conversion; leave attendance ranges unresolved; omit negated clauses; reject dimensions/unit rates as total budgets; show ambiguity messages. | Not a complete natural-language parser. Multilingual fixtures, broader currency/range parsing and evidence spans remain open. |
| [#30 — responsive QA](https://github.com/ummahbuild/mosque.build/issues/30) | Recovery and field review checked at 320, 360, 390, 430, 768 and 1024 pixels. No page overflow in these states. | The full CAD/route/device/standalone matrix remains open. |

Related import bugs found during testing: the package UI accepted unsupported brief versions/types, storage-read failures could escape restore error handling, and failed rollbacks claimed that all original data survived. Imports now reject unsupported briefs before confirmation. Restore snapshots all affected keys before writing, rolls back successfully written keys on failure, and explicitly reports incomplete recovery.

## Data behavior

- Current brief key remains `mosque-build.project-draft.v2`; schema is `mosque.build/project-draft@2`.
- Valid partial legacy briefs and `projectName` / `projectType` aliases are supported. Conflicting aliases, unknown fields, unsupported versions and invalid values require explicit recovery rather than silent stripping.
- A malformed current record is not hidden by falling back to an older legacy record.
- Merely opening a new or existing brief does not write defaults into storage.
- User edits compare the current storage snapshot with the version loaded by the editor. A stale tab retains its working state and offers download/reload instead of overwriting newer data.
- Explicit replacement saves the exact original raw text in `mosque-build.project-draft.recovery.v1` before writing the new brief. There is one local recovery slot, replaced by the next explicit replacement. Download the original for a durable copy; this is not cloud backup or revision history.
- A repaired raw draft or exported `mosque.build/project-brief@1` can be restored through recovery. This path is limited to 500 KB to accommodate UTF-8 expansion of valid multilingual notes and the export envelope, and does not reset other drawings or planning records. Parsed fields and raw draft text have additional bounds.
- Concept input is reparsed from its original text. Untrusted serialized computed fields are not applied directly. Unselected fields remain unchanged, notes append only with consent, and oversized combined notes reject the change instead of truncating saved work.
- Package restore is best-effort rollback across browser storage keys, not an atomic database transaction. Other package sections retain their existing generic safety checks; only the brief receives the new semantic validation in the import UI.
- Navbar actions update on same-tab project changes and cross-tab storage events, including reset and recovery states.

## Acceptance and verification

### Unit and integration tests

- `tests/project-draft-recovery.test.mjs`: malformed JSON, roots, versions, types, enums, duplicate choices, null fields, conflicting aliases, unknown fields, bounded text, multilingual export size, legacy restore, exact backup, quota failures, stale tabs and safe resumption.
- `tests/concept-brief-review.test.mjs`: consent boundaries for every field, unnamed existing projects, structured style/storeys persistence, additive needs, paired budget/currency, excessive notes, unsupported suggestions, ranges, negation and unit-rate regressions.
- `tests/project-package.test.mjs`: read-before-write failure, successful rollback, absent-key restoration and honest reporting of rollback failure; existing allowlist/prototype/depth/privacy checks retained.
- Full `pnpm test`: 575 tests, 574 passed, one optional IFC parser test skipped, zero failed.
- `pnpm validate`: pass (63 frames, 6315 normalized features, 20 public routes).
- `pnpm privacy:scan`: pass.
- `pnpm web:build`: pass, including TypeScript and 101 generated static pages. A malformed development-only generated type cache was moved aside after stopping the test server; it is not source code and will regenerate on the next dev run.
- Standalone `pnpm --dir apps/web exec tsc --noEmit`: pass after the cache cleanup.
- No lint command is configured in the repository. `git diff --check` passes.

### Browser integration and accessibility

Tested through the actual UI on a dedicated localhost origin with synthetic fixtures:

1. Save a named brief, review a concept, confirm nothing is preselected, accept only architecture interests/storeys, reload, and verify those values persist while name/type/location remain unchanged.
2. Open an invalid stored brief, reload without replacement, download and compare the exact original raw text, consent to restoration, import a repaired brief, reload and verify restored values.
3. Upload an invalid whole-project package; verify the error appears before a replacement button and the previous project remains visible.
4. Complete the recovered brief and reload; verify the resume card offers the existing workspace.
5. Edit the same brief in two tabs; verify the older tab shows an unsaved-work warning and download/reload controls instead of replacing the newer draft.
6. Recovery and concept review fit 320/360/390/430/768/1024 widths. Labels, checkboxes, disabled explanations and alert/status messages are exposed in the accessibility tree. Controls use visible focus styles and at least 44 px button/label targets. This is not a screen-reader certification or full keyboard-only audit.
7. No browser console warnings or errors observed in the tested flows. A navigation timeout during simultaneous compilation/test activity resolved without an application error.

Real-device virtual keyboards, installed standalone mode and iOS/Android browser parity remain review gates. Screenshot captures were retained locally during testing; no production user records were used.

### Security, provenance and human review

No API, database, authentication, permissions or cloud project storage changed. RLS tests are not applicable to this browser-local change; RLS remains required before any shared project/member persistence. Existing package allowlists, prototype-key and nesting limits remain covered. Downloaded full briefs/backups may contain user-entered private details, which the recovery screen explains.

No external permit, price, scholarly or supplier records were added. Suggested concept values remain unverified user-text interpretations. Authority, religious, structural, fire and MEP review gates are unchanged. Parser output does not certify design feasibility, costs or compliance.

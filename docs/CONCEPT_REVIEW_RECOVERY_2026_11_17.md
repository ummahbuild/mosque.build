# Concept review, consent and stale-tab recovery — 2026-11-17

Status: **executable**. Scope is the device-local concept-to-brief handoff, not generated architecture or verified project facts.

## Defects addressed

An older wizard tab could apply an obsolete pending concept and then unconditionally delete a newer concept queued in another tab. Keeping the existing brief had the same unguarded deletion. A draft conflict appeared only as a concept notice, without the working-copy download and reload controls already available for ordinary draft conflicts.

- Review captures the exact source envelope, validates its schema and bounds, and regenerates suggestions from the original text. Persisted derived fields are not trusted.
- Acceptance checks that source before invoking the brief save. Stale, deleted and unreadable pending concepts cannot initiate a save.
- Dismissal and post-save cleanup clear only a matching source. A newer source queued during the save is retained for separate review.
- Cleanup failure after a successful save is reported as a saved brief with pending cleanup, avoiding a misleading retry that could duplicate appended notes.
- A stale source offers **Review latest concept** and a link back to the concept editor. Reloading the proposal resets all field selections and focuses its heading.
- A stale saved brief exposes **Download working brief** and **Reload saved brief**. Suggestions remain blocked until the conflict is resolved. Reloading the brief resets field selections so updated current values receive a fresh review.
- Existing per-field consent, source evidence, current/proposed values and exact-original recovery copies remain in place. Style and storeys remain structured draft fields, with no change to unrelated brief fields.

These are optimistic snapshot checks on browser storage, not a cross-tab transaction or collaborative database. There remains an interleaving window between a storage comparison and a subsequent write/removal. Shared collaborative editing requires a separate transactional design and authorization model.

## Acceptance and review gates

- Unit: pending-envelope validation; source reparse; stale, deleted, replaced, oversized and malformed records; unavailable reads; guarded dismissal; post-save cleanup outcomes.
- Integration: actual parser, per-field merge and draft persistence exercised together for populated and empty briefs; structured styles/storeys survive reload; exact previous draft backed up; stale draft and quota failures preserve the pending concept and original brief.
- Security/RLS: no new server, authentication or shared project data. RLS is not applicable to this local-only change. Existing security tests remain in the full suite. Imported text stays React-escaped.
- Accessibility: native labelled checkboxes and buttons; disabled-state explanation; live recovery notices; focus on a newly loaded review heading. Browser checks recorded below.
- Mobile/web parity: responsive browser checks recorded below. Physical devices, virtual keyboards and installed standalone mode are not certified by this change.
- Source/provenance: no new external factual records. Original user text and parser evidence remain the source of suggestions; these are not verified location, cost or architectural facts.
- Professional/religious review: unchanged. This change neither supplies authority evidence nor validates a buildable design.

## Validation

- Full test suite: **1030 passed, one pre-existing optional IFC skip** (1031 total). The 27 new handoff tests also passed after the final selection-reset change.
- Production build and TypeScript: both runs passed, including the final selection-reset change; 101 static pages generated.
- Repository validation: passed (63 frames, 6315 normalized features, 20 public routes).
- Privacy scan: passed (1400 repository files before this report was added).
- Diff whitespace check: passed.
- No lint script is configured; the build performs TypeScript checking.


## Browser evidence — completed 2026-11-18

Used the actual production build at a fresh local origin with synthetic project data; no browser storage was seeded through scripts.

1. Created an existing expansion brief with its own name and location. Submitted a Moroccan/madrasa concept from the homepage. The review showed original-source evidence, current/proposed differences and no fields preselected.
2. Accepted only architecture interests and storeys. The review screen and a full page reload retained `Moroccan` and `3` while preserving the existing name, expansion type, location, empty budget/attendance/notes and two original program needs.
3. Opened the same pending concept in two tabs, then queued a different Ottoman/Istanbul concept in one tab. Applying the old location in the other tab was blocked and Apply became disabled.
4. Chose **Keep existing brief** in the stale tab. The newer concept survived. Activated **Review latest concept** using Enter: the latest proposal appeared, all eight checkboxes were unchecked, and the review heading received focus.
5. Changed the saved brief name in the second tab, then attempted to apply the first tab's suggestion. The saved-brief conflict exposed **Download working brief** and **Reload saved brief**, blocking acceptance.
6. The browser automation stalled on the download/reload interaction in that test tab. The expected downloaded file was not found, so download completion and the confirmation/reload interaction are **not certified by this browser run**. Storage recovery remains covered by integration tests; these browser steps need another run. A full page reload in the working tab did display the latest saved brief and reset selections.
7. Working-tab responsive checks at 320, 360, 390, 430, 768, 1024 and 1440 px showed no page-level horizontal overflow. Review action buttons were 46.5 px high, with whole-label checkbox targets above 44 px. A focused checkbox had a visible 3 px outline. No console warnings/errors were captured in that tab.

The broader acceptance issues #15, #20, #30, #26 and #22 remain open. This is a verified bug-fix slice, not completion of their remaining browser/device coverage.

### Screenshots

- [1024 px: source evidence and field-by-field review](qa/2026-11-18/concept-review-1024.jpg)
- [390 px: readable single-column fields and keyboard focus](qa/2026-11-18/concept-review-390.jpg)

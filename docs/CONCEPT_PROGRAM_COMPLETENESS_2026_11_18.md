# Complete preliminary room requirements — 2026-11-18

Status: **executable**. Related to #16 and #29; this corrects the preliminary program and sample-plan comparison, not automatic generation of a dimensioned or approved building.

## Reproduced defect

The prompt `A mosque for 300 people with a youth space, kitchen for iftar and janazah facilities.` produced three recognized program needs but only a prayer hall in the room preview. The sample-floor-plan comparison consequently omitted all three unresolved support spaces.

## Changes

- One registry now maps all 12 supported project-brief needs to preliminary requirements. Youth, kitchen/iftar and janazah spaces now appear when recognized in a concept. Waqf/income-generating space is also handled when supplied as a structured need; this change does not expand the text parser's waqf vocabulary.
- Each room requirement includes a practical explanation of what needs to be agreed before dimensions are set. The homepage displays this existing `basis` field beneath the room name.
- Only the existing conceptual prayer-zone allowance can produce an area. All support-space areas and the overall total remain unknown; no dimensions, fixture counts, legal standards, prices or approvals are invented.
- Repeated needs produce one requirement each. Unknown or unreadable needs create explicit review warnings. Needs with ambiguous, unspecified or missing evidence are not promoted into additional spaces; legacy inputs without an evidence object remain supported.
- The sample comparison receives the complete list and counts all unresolved spaces. It does not modify saved drawings or resize the sample.

## Acceptance and review gates

- Unit: coverage of every supported brief need; unique requirements; unknown areas; immutable inputs/results; parser-recognized and negated programs; stale evidence; unreadable and unsupported needs.
- Integration: parser → room program → sample-plan comparison retains youth, kitchen and janazah requirements, including unknown attendance, without changing sample area/revision. UI wiring exposes sizing considerations.
- Security/RLS: this is local derivation and rendering. No network, authorization, database or shared-project storage changes; RLS is not applicable. Existing security tests remain in the full suite.
- Accessibility: room names, review considerations and areas remain normal list text. No extra interaction or hidden focus targets are introduced; browser checks below cover existing controls and responsive rendering.
- Mobile/web parity: browser viewport checks below; no physical-device, virtual-keyboard or installed-standalone certification.
- Source/provenance: no new external factual records. Test prompts are synthetic. Sizing notes are review questions, not cited local requirements or standards.
- Professional/religious review: all room requirements retain `reviewRequired: true`. Janazah scope requires community, religious and qualified professional review. No sacred content or religious rulings are generated.

## Validation

- Focused tests: 37 passed, including 26 new regressions across room derivation, sample-plan comparison and UI wiring.
- Full `pnpm test`: 1,125 passed, one existing optional IFC skip (1,126 total).
- `pnpm web:build`: passed, including TypeScript and 101 prerendered pages. No standalone lint script is configured.
- `pnpm validate`: passed (63 frames, 6,315 features, 20 routes). `pnpm privacy:scan` and `git diff --check`: passed.
- Production-build browser checks at 320, 390, 768, 1,024 and 1,440 px: no page or room-row horizontal overflow. Notes and unresolved areas wrap on narrow screens; the review button is 45 px high.
- Browser flow: the synthetic 300-person prompt displays all four requirements and the existing indicative 375 m² prayer allowance; the unchanged 64 m² sample comparison reports three unresolved spaces. Removing attendance leaves all four areas unknown.
- Browser handoff: no import fields are preselected; applying only program needs adds Youth, Kitchen / iftar and Janazah alongside the existing Prayer hall and Wudu. All five selections survive reload; unselected attendance remains empty.
- Browser console: no warnings or errors recorded during the tested flow. This is viewport testing, not physical-device or installed-standalone certification.
- Visual evidence: [desktop](qa/2026-11-18/concept-program-1024.jpg) and [mobile](qa/2026-11-18/concept-program-390.jpg).

The broader concept-generation and CAD handoff issues remain open: this fix preserves requirements but does not generate rooms, approved areas or a buildable model.

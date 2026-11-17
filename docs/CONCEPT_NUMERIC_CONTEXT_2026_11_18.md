# Concept quantities and non-place context — 2026-11-18

Status: **executable**. Related to #20 and #17; this is a bounded parser correction, not general natural-language understanding or verified project information.

## Reproduced defects

- `Budget USD 1e6` became a suggested budget of `1`; multiplication, exponent and percentage forms also exposed only their leading number.
- `400 people per day` became an attendance of `400`, which the preliminary room program used to calculate a prayer-zone area. Visits across a period do not establish simultaneous prayer attendance.
- `in phase two`, `in total` and `at Jumuah` became locality suggestions. They could also conflict with an explicitly stated city earlier in the prompt.

## Changes

- Unsupported scientific notation, arithmetic, percentages and split numeric expressions require clarification. Supported decimal, grouped, Indian-grouped, lakh/crore and explicit magnitude formats remain available.
- Time-based attendance wording is labelled ambiguous, with a request for the number expected at one prayer. Its preliminary prayer-zone area stays unknown.
- Known planning, time and prayer phrases are excluded from locality candidates. A separate explicit locality keeps only its own source span. No locality is inferred when only non-place phrases are present.
- Parser version advances to `mosque.build/concept-parser@4`; original text, source offsets and per-field consent remain unchanged.
- Existing brief fields cannot be overwritten by these ambiguous suggestions, even if their field identifiers are passed to the merge function.

## Acceptance and review gates

- Unit: table-driven regression cases cover unsupported notation, Arabic digits, percentages, daily/weekly/monthly counts, non-place phrases and supported numeric/location controls.
- Integration: parser → room program leaves attendance-derived area unknown; parser → reviewed brief merge preserves existing values for ambiguous fields.
- Security/RLS: no new network calls, authorization, shared storage or database writes. RLS is not applicable to this local parser change. Existing security tests run in the full suite.
- Accessibility/mobile: unchanged native controls and evidence components; browser checks below verify clarification, disabled consent and responsive layout.
- Source/provenance: exact original-text spans are asserted. All new prompts are synthetic regression inputs; no external prices, localities or legal facts are added as verified records.
- Professional/religious review: unchanged. A stated prayer occasion is text context, not a religious ruling; room areas remain conceptual and require qualified review.

## Limitations

This is a deterministic parser with a bounded phrase vocabulary. Ambiguous expressions require user clarification; it does not claim to recognize every language, locality, numeric convention or daily attendance phrasing. Existing costs, site facts and geometry are not professionally validated by these changes.

## Validation

- Full suite after the final parser changes: **1099 passed, one pre-existing optional IFC skip** (1100 total).
- 69 new regression tests cover the reproduced defects and supported-input controls.
- Both production builds/TypeScript checks passed, including the final arithmetic/percentage correction; 101 static pages generated.
- Repository validation and privacy scan passed; final documentation scan follows browser evidence.
- No lint script is configured; the production build checks TypeScript.


## Browser verification

Tested the final production build at a fresh local origin using actual UI interactions and synthetic data. No browser storage was seeded through scripts.

1. Created a populated expansion brief with `Saved location`, attendance `250`, and budget `EUR 900000`.
2. Reviewed `A mosque in phase two for 400 people per day, budget USD 1e6.` on the homepage. Location, attendance, budget and currency showed clarification messages and original evidence. The preliminary prayer hall showed **Area to determine**, with no invented capacity-derived area.
3. Continued to the project wizard. Location, attendance and budget checkboxes were disabled; each explained that the current value would be kept. No fields were preselected.
4. Accepted only the original text as notes. The project name, expansion type, location, attendance and budget remained unchanged, including after a full page reload. The notes field retained the exact original concept.
5. Reviewed the valid control `A mosque in Rabat for 400 people at Jumuah, budget USD 1000000.`. It kept Rabat as the locality, suggested attendance 400 and USD 1000000, and showed the existing conceptual 500 m² prayer-zone estimate with its limitations.
6. Accepted only attendance from that valid proposal. Attendance changed to 400 while the existing location, expansion type and EUR 900000 budget remained unchanged.
7. At 320, 390, 768, 1024 and 1440 px, page width matched viewport width and review action buttons were 46.5 px high. Mobile evidence cards remained readable; keyboard Page Down reached the evidence. No console warnings/errors were captured.

Physical mobile devices, virtual keyboards, installed standalone mode and broader route coverage remain unverified here. Issues #20, #17 and the broader mobile QA issues remain open.

### Screenshots

- [1024 px: current values and clarification evidence](qa/2026-11-18/concept-ambiguity-1024.jpg)
- [390 px: readable disabled fields and reasons](qa/2026-11-18/concept-ambiguity-390.jpg)

# Concept quantities: context, clarification and saved-brief protection

Status: **executable**. Follow-up to [#17](https://github.com/ummahbuild/mosque.build/issues/17), [#20](https://github.com/ummahbuild/mosque.build/issues/20) and the reviewed-import scope of [#15](https://github.com/ummahbuild/mosque.build/issues/15). These broad issues remain open; this release does not claim complete natural-language understanding.

## Reproduced problems and fixes

| Input | Previous result | Current result |
| --- | --- | --- |
| Land costs USD 50000. | Project budget 50000 USD | Requires clarification; the land amount is not promoted to the overall project budget. |
| Annual operating budget USD 50000. | Project budget 50000 USD | Recurring/operating cost context is preserved and overall budget remains unresolved. |
| A neighborhood where 10000 people live. | Attendance 10000 | Population context requires a separate prayer-attendance value. |
| A mosque for 300 worshippers initially and 500 eventually. | Attendance 300 | Future phases require an explicit choice of the phase being planned. |
| A mosque for approximately 400 people. | Attendance 400 | Approximation is visible and no exact area is generated. |
| A mosque for 300+ people. | No explanation | Limit is identified and explained. |
| Incapacity 300. | Prefix substring could produce attendance | Prefix matching uses word boundaries. |
| Capacity 300 m². | Area could be read as a person count | Area/volume units are not converted into attendance. |

Additional coverage includes donations, pledges, grants, component costs, periodic costs, comparative signs, minimum/maximum wording, storey approximations and selected Swahili/Arabic phrases. Explicit overall budgets, decimal amounts, Indian number grouping, separate room needs and floor counts continue to work.

The parser version is `mosque.build/concept-parser@3`. Original source text and offsets are retained, including Arabic digits. Contextual quotes include the words that caused uncertainty. Reason messages distinguish population, phase, approximation and dimension cases.

The import review only enables fields whose available evidence is `suggested`. The merge function independently applies the same guard, including incomplete evidence objects. The room-program calculation also refuses ambiguous, unspecified or missing evidence when an evidence record is present. Stale numeric fields therefore cannot bypass the review boundary or produce an indicative prayer-area estimate. Legacy typed inputs without evidence retain their existing bounded-number behavior.

## Verification and acceptance

- **Unit/regression:** 62 new context/quantity tests plus two saved-brief integration tests. Tests cover supported and unsupported contexts, exact source offsets, original-text preservation, valid values alongside unrelated needs, malformed/incomplete evidence and downstream unknown-area behavior.
- **Integration:** Ambiguous land/attendance suggestions cannot overwrite a populated brief even if passed to the merge function. In the browser, accepting only Library preserved attendance 120 and budget EUR 750000 after reload. A subsequent explicit budget-only acceptance changed the budget to EUR 900000 while attendance stayed 120. A further clarified proposal exposed both checkboxes for explicit acceptance, and “Keep existing brief” dismissed it.
- **Full suite:** 907 passed, one existing independent IFC validation/tessellation test skipped, zero failures.
- **Build/checks:** Production build including TypeScript, repository validation, privacy scan and whitespace checks passed. No standalone lint script is configured.
- **Accessibility:** Disabled uncertain fields have labels, visible explanations and quoted source text. Clarified values remain selectable; applying one field was verified with Enter. These browser checks are not a screen-reader certification.
- **Responsive:** Existing-brief clarification checked at 320, 360, 390, 430, 768 and 1024 px; no page-level horizontal overflow. Six real browser screenshots are linked below.
- **Console:** No browser console warnings/errors in the exercised flows. Automation was synchronized to the review UI after hydration before checking actionable fields.
- **RLS/security:** No server, authentication, database or shared project storage changes. RLS tests are not applicable to this local parsing change. Existing saved-project and raw-text preservation safeguards remain in place.
- **Provenance:** No external factual records or real price estimates added. Test amounts and locations are synthetic user-text examples, not market data. Evidence is attribution to the user's original text, not external verification.
- **Human review:** Concepts and area assumptions remain conceptual; permit, financial, structural, fire and religious review boundaries are unchanged. Physical-device, native-app and virtual-keyboard parity remain manual QA gates.

## Screenshots

The captures use a synthetic brief on a dedicated local origin; no production project records were changed.

[320 px](qa/2026-11-17/concept-quantity-320.png) · [360 px](qa/2026-11-17/concept-quantity-360.png) · [390 px](qa/2026-11-17/concept-quantity-390.png) · [430 px](qa/2026-11-17/concept-quantity-430.png) · [768 px](qa/2026-11-17/concept-quantity-768.png) · [1024 px](qa/2026-11-17/concept-quantity-1024.png)

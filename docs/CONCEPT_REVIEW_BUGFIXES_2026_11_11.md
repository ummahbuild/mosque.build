# Concept parsing and reviewed brief imports — 2026-11-11

Related GitHub issues: [#20](https://github.com/ummahbuild/mosque.build/issues/20), [#17](https://github.com/ummahbuild/mosque.build/issues/17), [#15](https://github.com/ummahbuild/mosque.build/issues/15). Responsive follow-up: [#22](https://github.com/ummahbuild/mosque.build/issues/22), [#26](https://github.com/ummahbuild/mosque.build/issues/26), [#30](https://github.com/ummahbuild/mosque.build/issues/30).

Status: **executable**, with a deliberately bounded English/Swahili/Arabic grammar. This is reviewed text extraction, not universal language understanding, verified geography, cost estimating, religious interpretation or design approval.

## Defects addressed

- Bare dollar, rupee and dirham shorthand no longer silently establishes a currency.
- KES, INR and MAD remain distinct currencies through review, save, reload and the wizard currency selector.
- Currency before/after amounts, lakh/crore, ordinary/Indian number grouping, and supported Arabic/Persian digits are parsed explicitly.
- Decimal-comma ambiguity and unsupported magnitudes cannot become misleading smaller amounts.
- Fractional amounts are preserved to supported currency precision rather than rounded to whole units.
- Budget ranges, alternatives, mismatched currencies, negative amounts, recurring rates and per-person/per-area rates are withheld for clarification.
- Unknown currency stays unknown and never inherits the previous brief's currency when a new amount is accepted.
- Budget upper limits are labelled as limits, not exact cost estimates.
- Attendance ranges, alternatives, lower/upper limits, invalid counts and contextual population quantities are withheld.
- Storey ranges, fractional/zero/unsupported storeys and negated storey requirements are withheld.
- Location alternatives, building descriptions and unclear abbreviated names do not become verified-looking localities.
- Comma-separated locality text such as Kilimani, Nairobi is retained when explicitly supplied.
- English, supported Swahili and supported Arabic negative clauses are excluded without changing original source offsets.
- A nearby school no longer becomes a requested madrasa; positive requirements after supported contrast words remain available.
- Architecture style matching uses word boundaries rather than accidental substrings, and excludes parsed locality/budget phrases.
- Missing project intent no longer automatically becomes a parser suggestion for a new mosque.
- Explicit expansion intent is recognized separately from a new mosque; a standalone school is not classified as mosque + madrasa.
- Every parsed field has a status (`suggested`, `ambiguous`, `unspecified`), evidence category and exact source spans.
- Source spans use JavaScript UTF-16 string offsets into the unchanged bounded original, including Arabic/Persian-digit inputs.
- Prompt review and per-field import review display source quotations and clarification reasons.
- Uncertain suggestions cannot overwrite a saved field through the reviewed merge function.
- Existing brief values remain unchanged unless their corresponding field is explicitly selected. Budget and currency are one reviewed change.
- Large existing notes are summarized in the comparison without changing stored notes.
- Editing a prompt closes its old review, and parsing is memoized rather than repeated on every placeholder-animation tick.
- The handoff stores the original text and parser version, then reparses at the wizard; large duplicated evidence arrays no longer inflate the handoff beyond its read limit.
- Saving a concept preserves original whitespace and line breaks. Continuing into the brief also saves the original concept independently of the optional notes import.
- Stale tabs cannot overwrite or clear a newer saved concept.
- Failed initial storage reads do not authorize overwriting or clearing unknown saved data.
- A failed clear keeps the visible text available; an oversized saved concept stays visible with a warning and plain-text download.
- The clear action says “Clear saved concept” rather than implying that it deletes the project brief.
- Prompt help explains the user's next action without developer-facing AI implementation copy.

## Verification and acceptance gates

- **Unit / integration:** `tests/fixtures/concepts/review-prompts.json` contains 85 independently written synthetic variants across Kenya, India and Morocco, including supported Swahili and Arabic grammar. Tests verify expected fields, ambiguity, negation, exact source spans, existing/new/conflicting brief merges, regional currency round trips and storage failure/conflict behavior.
- **Browser:** production-build checks covered prompt → source review → selective import into new and existing briefs, unchanged unselected fields, KES reload, Enter/Space keyboard controls, ambiguous-field disabling, and two-tab save/clear conflicts. Prompt views were checked at 320/360/390/430/768/1024/1440px; import review at 320/390/768/1024/1440px. No page overflow or browser console errors were observed. Original text, including whitespace and line breaks, was verified after importing attendance without appending notes.
- **Security / RLS:** no new server, shared-project persistence or authorization path. Storage boundaries and stale-write checks are tested. User text is rendered through React text nodes, with no HTML interpretation or network lookup.
- **Source / provenance:** fixtures are synthetic parser inputs, not claims about real projects, prices, laws, capacity or locations. Evidence is attributed to the user's words; no geolocation/IP inference, geocoding or currency conversion is performed.
- **Accessibility / parity:** semantic labels, source text direction, disabled-field reasons, keyboard-operable selection and responsive evidence layouts. Physical iOS/Android keyboards, installed standalone mode and screen-reader certification remain device review gates.
- **Professional / religious review:** no compliance, structural, religious or cost conclusions are added. Program area assumptions remain conceptual and require qualified review.
- **Release checks:** repository test suite, TypeScript/production build, validation, privacy scan, dependency audit in hosted CI. The existing optional external IFC-parser test remains skipped when its dependency is absent.

## Known limits and next work

- Grammar is intentionally limited; arbitrary prose and additional languages may remain unrecognized. Unknown fields are editable in the brief rather than guessed.
- More complex negation is conservatively withheld. The original text remains available for review.
- Source evidence describes why a suggestion appeared, not whether the statement is true.
- Prompt input/handoff is bounded to 3,000 characters. Oversized saved text can be downloaded before shortening.
- Geographic and currency ambiguity cannot be resolved from city/country context alone.
- Continue physical-device QA for #22/#26/#30 and parametric layout work for #16/#29 separately.

# Cost-control rule integration development plan

## Source intake

The user-supplied CSV contains 100 unique records: 10 massing, 10 structure, 10 roof, 6 minaret, 10 envelope, 14 interior, 8 wudu, 10 MEP, 7 site, 8 development and 7 construction strategies. Its IDs and eight columns match the canonical repository JSON exactly. The dataset is retained as an unreviewed source contribution. Redistribution rights and multidisciplinary review remain open.

No rule states a verified saving amount. The product must not invent one. Any monetary comparison needs a dated baseline and alternative with geography, currency, quantities, rates, source, maturity, confidence and exclusions.

## Implemented now (`executable` locally)

- All 100 rules remain searchable and assessable with stable IDs.
- Applicable rules now generate category-specific connections to design, quantity/cost, procurement, schedule, construction and operations records.
- Connection cards distinguish a local record from a missing record.
- Every connection names the required coordination question and review role.
- Integration gaps combine rule-review gaps with missing downstream records.
- A bounded coordination packet preserves the source rule, review, parameter, connections, gaps and decision boundary.
- The packet persists locally, exports with the project package and appears in the connected workflow and Project Action Desk.
- A requirements-led marketplace handoff carries the rule and verification questions without asserting price, availability or saving.
- Design and Construction expose the same coordination workflow.
- Baseline and alternative studies now select measured lines from the regional cost plan.
- Comparable totals remain separated by option and use the cost plan's entered base scenario.
- Results remain unavailable when dates, currencies, quantities, rates, price sources, scope or ownership are missing.
- Same-currency comparison calculates an entered difference and percentage without labeling it a forecast saving.
- Model revision, scope, lifecycle, worship, accessibility, operations, exclusions, evidence and decision records persist with each comparison.
- Option studies export with the portable project package and appear in the connected workflow and Project Action Desk.

## Adjacent feature backlog

### Baselines and alternatives (`executable` locally; deeper revision history remains `specified`)

1. Versioned baseline definition. 2. Alternative definition. 3. Scope-difference register. 4. Quantity-difference register. 5. Unit normalization. 6. Geography metadata. 7. Currency metadata. 8. Pricing date. 9. Source maturity. 10. Confidence and exclusions. 11. Mixed-currency isolation. 12. Baseline supersession history.

### Design and model coordination (`specified`)

13. Parameter-to-domain-property mapping. 14. Before-and-after model branch IDs. 15. Geometry quantity deltas. 16. Area/perimeter checks. 17. Repetition and unique-part schedules. 18. Span/grid comparison. 19. Roof edge and penetration comparison. 20. Envelope opening ratios. 21. Wudu fixture and route quantities. 22. MEP route and capacity effects. 23. Site external-work quantities. 24. Accessibility-preservation checks.

### Cost and lifecycle review (`specified`)

25. Sourced option estimates. 26. Entered low/base/high ranges. 27. Construction cost separation. 28. Operating cost separation. 29. Maintenance task effects. 30. Replacement-cycle evidence. 31. Energy and water evidence links. 32. Waste and rework records. 33. Salvage and reuse records. 34. Carbon evidence links. 35. Sensitivity inputs. 36. No-result state for missing evidence.

### Procurement and delivery (`specified`)

37. Rule-to-scope mapping. 38. RFQ requirement generation. 39. Bid clarification links. 40. Substitution workflow. 41. Capability evidence. 42. Sample and mockup gates. 43. Lead-time evidence. 44. Landed-cost components. 45. Warranty comparisons. 46. Spare-parts evidence. 47. Competition checks. 48. Conflict-of-interest controls.

### Construction and learning (`specified`)

49. Rule-to-activity mapping. 50. Make-ready constraints. 51. Inspection hold points. 52. Change-control linkage. 53. Installed-quantity evidence. 54. Defect and rework linkage. 55. Commissioning requirements. 56. Post-occupancy observation. 57. Actual outcome record. 58. Baseline-versus-outcome explanation. 59. Reusable lessons with context. 60. Rule retirement and supersession.

## Review and release gates

Each adjacent feature needs unit, integration, accessibility and mobile tests. Cost logic needs boundary, missing-input, currency, unit, duplicate-key and source-provenance tests. Regulated design needs qualified professional review. Worship, dignity and community-use trade-offs need community review. Cloud collaboration requires authenticated organizations, member roles, RLS tests, immutable history and explicit local-to-account migration.

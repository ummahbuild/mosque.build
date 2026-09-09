# Regional material pricing and cost integration — 100 delivered improvements

Status: `executable` locally. The engine calculates only from entered quantities, prices and adjustments; it does not publish scraped prices, convert currencies, predict inflation, verify availability, recommend suppliers or approve budgets.

1. Versioned the regional material cost-plan schema.
2. Added bounded import validation.
3. Added whole-project package portability.
4. Integrated the cost plan into the project workflow.
5. Linked cost planning to material decisions.
6. Linked cost planning to the project schedule.
7. Added coarse country-code context.
8. Added market or metro context.
9. Added regional market context.
10. Added privacy-preserving location precision.
11. Added supplier distance-band context.
12. Added a working project currency.
13. Added estimate basis dates.
14. Added price-level dates.
15. Added cost-plan revisions.
16. Added preparation-role accountability.
17. Added independent review-role accountability.
18. Added official-index source records.
19. Added supplier-quote source records.
20. Added supplier-catalog observation records.
21. Added merchant observation records.
22. Added tender-return records.
23. Added cost-professional input records.
24. Added source publisher metadata.
25. Added source geography metadata.
26. Added source currency metadata.
27. Added observation dates.
28. Added source publication periods.
29. Added URL or document references.
30. Added rights and permitted-use notes.
31. Added low, medium and high confidence.
32. Added explicit source review status.
33. Added source limitations and notes.
34. Added a reviewed official-source directory.
35. Added Kenya construction input index discovery.
36. Added United States producer index discovery.
37. Added United Kingdom material-index discovery.
38. Added Philippines wholesale-index discovery.
39. Added South Africa construction-index discovery.
40. Added Singapore market-price dataset discovery.
41. Avoided seeding unverified material prices.
42. Added import from material-selection records.
43. Preserved material source IDs during import.
44. Prevented duplicate material imports.
45. Added sixteen material work groups.
46. Added thirteen measurement units.
47. Added detailed material specifications.
48. Added quantity inputs.
49. Added low unit-price inputs.
50. Added base unit-price inputs.
51. Added high unit-price inputs.
52. Added source currency per line.
53. Added line-to-price-source links.
54. Added explicit waste percentages.
55. Added freight totals.
56. Added handling totals.
57. Added installation-labor totals.
58. Added equipment totals.
59. Added tax percentages.
60. Added contingency percentages.
61. Added quote-validity dates.
62. Added lead-time inputs.
63. Added exclusions.
64. Added responsible cost-review roles.
65. Added schedule activity links.
66. Added work-package links.
67. Added reviewed user-record state.
68. Added approved user-record state.
69. Added optional base indices.
70. Added optional current indices.
71. Added linked index sources.
72. Added transparent index-factor calculation.
73. Added waste-adjusted quantity calculation.
74. Added indexed unit-rate calculation.
75. Added material subtotal calculation.
76. Added delivered direct-cost calculation.
77. Added separate tax calculation.
78. Added separate contingency calculation.
79. Added complete line-total calculation.
80. Added entered low-cost scenarios.
81. Added entered base-cost scenarios.
82. Added entered high-cost scenarios.
83. Kept mixed currencies in separate totals.
84. Added inconsistent price-range detection.
85. Added incomplete market-basis detection.
86. Added missing cost-plan date detection.
87. Added incomplete source-provenance detection.
88. Added pending source-review prompts.
89. Added missing quantity and base-rate detection.
90. Added missing material-specification prompts.
91. Added broken price-source detection.
92. Added missing line-currency detection.
93. Added incomplete index-pair detection.
94. Added missing index-source detection.
95. Added elapsed quote-validity prompts.
96. Added missing exclusion prompts.
97. Added missing planning-link prompts.
98. Added unsupported approval-state detection.
99. Added responsive scenario totals and schedule.
100. Added JSON and CSV evidence-preserving exports.

## Cost boundary

Every price record requires geography, currency, date, source, maturity, confidence and exclusions. Official indices describe trends within their published scope; they are not local supplier quotations. Confirm specifications, units, conversions, tax, duty, freight, validity, exclusions and market rates with suppliers and a qualified cost professional. Protect private site and supplier information when exporting or sharing records.


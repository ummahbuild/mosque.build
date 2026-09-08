# Knowledge library — 100 delivered improvements

Status: `executable`. This batch implements a device-local planning workflow. It does not publish a wishlist, accept donations, recommend religious works, verify sellers, or classify a gift or fund as waqf.

1. Replaced the static route with a working library planner.
2. Added a renderer-neutral knowledge-library schema.
3. Added schema-versioned device persistence.
4. Added bounded restore validation.
5. Limited restored plans to 200 records.
6. Limited restored text-field lengths.
7. Bounded requested-copy quantities.
8. Bounded inventory-copy quantities.
9. Added safe recovery from corrupt storage.
10. Added project-package portability.
11. Added an accountable curator-role field.
12. Avoided requiring a person’s name.
13. Added a declared curriculum field.
14. Added a community-request context field.
15. Added reference-only circulation planning.
16. Added lending circulation planning.
17. Added mixed circulation planning.
18. Added an undecided circulation state.
19. Added a storage-not-assessed state.
20. Added limited-storage planning.
21. Added adequate-storage planning.
22. Added Quran or translation as a content type.
23. Added tafsir as a content type.
24. Added hadith as a content type.
25. Added fiqh as a content type.
26. Added seerah as a content type.
27. Added Arabic learning as a content type.
28. Added children and youth as a content type.
29. Added new-Muslim resources as a content type.
30. Added reference works as a content type.
31. Added library equipment as a need type.
32. Added neutral Quran or translation planning template.
33. Added neutral Arabic class-set planning template.
34. Added neutral children and youth planning template.
35. Added neutral new-Muslim planning template.
36. Added neutral teacher-reference planning template.
37. Added neutral shelving and cataloguing template.
38. Prevented duplicate addition of starter templates.
39. Added exact resource or collection title capture.
40. Added explicit language capture.
41. Added explicit audience capture.
42. Added format capture.
43. Added requested-copy capture.
44. Added existing-stock capture.
45. Added essential priority.
46. Added useful priority.
47. Added future priority.
48. Added needs-curator-review status.
49. Added curator-reviewed status.
50. Added scholarly-review-required status.
51. Added edition, ISBN, or catalog-reference capture.
52. Added evidence or request-reference capture.
53. Added per-item notes to the domain model.
54. Added validation before adding unnamed needs.
55. Added a visible saved-state response.
56. Added a visible storage-error response.
57. Added request-count metric.
58. Added requested-copy metric calculation.
59. Added held-copy metric calculation.
60. Added unmet-copy metric.
61. Added curator-readiness percentage.
62. Capped held copies in coverage calculations.
63. Added per-item stock-progress visualization.
64. Added text alongside progress color.
65. Added search across titles.
66. Added search across content types.
67. Added search across languages.
68. Added search across audiences.
69. Added search across notes.
70. Added content-type filtering.
71. Added complete request view.
72. Added owned-inventory view.
73. Added unresolved-review view.
74. Added live result counts.
75. Added a useful empty state.
76. Added one-action filter reset.
77. Added per-record removal.
78. Added editable stock quantities.
79. Added editable priorities.
80. Added editable review states.
81. Added editable edition references.
82. Added editable evidence references.
83. Added portable JSON export.
84. Added a machine-readable export notice.
85. Added CSV gap-register export.
86. Added CSV quote escaping.
87. Added explicit gap columns to CSV.
88. Added disabled export states for empty plans.
89. Added specification-led Marketplace handoff.
90. Added unmet quantities to the sourcing handoff.
91. Added exact-edition verification prompts.
92. Added publisher and contributor verification prompts.
93. Added rights and condition verification prompts.
94. Added landed-cost and availability verification prompts.
95. Added handoff-specific Marketplace feedback.
96. Added prevention of sourcing an empty gap list.
97. Added keyboard-visible focus through shared controls.
98. Added 44-pixel minimum primary action targets.
99. Added responsive single-column mobile layouts.
100. Added explicit religious, commercial, legal, governance, tax, and Shariah review boundaries.

## Verification contract

Production-bound next steps remain integration tests for project restore, browser accessibility tests, mobile parity checks, and accountable curator/professional review before any public gifting or waqf workflow is described as ready.

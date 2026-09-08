# Material selection and construction — 100 implemented improvements

Status: `executable`. This release creates a local, renderer-neutral decision register. It does not assert product performance, certification, price, availability, installation quality, compliance, or approval.

## Selection foundation

1. Added a versioned material-selection schema.
2. Added bounded, defensive local-data restore.
3. Added a 200-record safety ceiling.
4. Added explicit candidate lifecycle stages.
5. Added separate sample workflow states.
6. Added separate decision workflow states.
7. Added vendor-neutral material naming.
8. Added assembly-group classification.
9. Added location and zone context.
10. Added intended-application statements.
11. Added accountable roles without personal names.
12. Added creation timestamps.
13. Added update timestamps.
14. Added persistent device-local saving.
15. Added project-change notifications.
16. Added save-failure feedback.
17. Added project-package portability.
18. Added JSON register export.
19. Added a machine-readable executable status.
20. Added an explicit export boundary.

## Exposure and performance

21. Added external-weather exposure prompts.
22. Added direct-sun and heat prompts.
23. Added wind-driven-rain prompts.
24. Added ground-moisture prompts.
25. Added flood-recovery prompts.
26. Added high-humidity prompts.
27. Added cleaning-chemical prompts.
28. Added high-footfall prompts.
29. Added wudu-splash prompts.
30. Added acoustic-sensitivity prompts.
31. Added fire-strategy interface prompts.
32. Added food-service-use prompts.
33. Added child-contact prompts.
34. Added impact-risk prompts.
35. Added salt and coastal-air prompts.
36. Added multi-exposure selection.
37. Added an exposure review gate.
38. Added performance-evidence references.
39. Added open performance questions.
40. Prevented marketing copy from becoming an automatic verified claim.

## Provenance and evidence

41. Added source or document references.
42. Added observed or checked dates.
43. Added rights and use notes.
44. Added provenance completeness checks.
45. Added evidence-coverage metrics.
46. Added missing-evidence messaging.
47. Added user-entered evidence boundaries.
48. Added length limits to source fields.
49. Added date-format validation.
50. Added invalid-record rejection on restore.

## Samples and mockups

51. Added sample-request tracking.
52. Added sample-received tracking.
53. Added sample-review tracking.
54. Added rejected-sample tracking.
55. Added sample record references.
56. Added sample metrics.
57. Added coordinated mockup references.
58. Added substrate and backing records.
59. Added edge coordination notes.
60. Added joint coordination notes.
61. Added penetration coordination notes.
62. Added adjacent-interface notes.
63. Added a sample gate before mockup progression.
64. Added a mockup gate before selection.
65. Kept sample status independent of final selection.

## Procurement and construction

66. Added delivery planning.
67. Added site-storage planning.
68. Added material-protection planning.
69. Added installation-method references.
70. Added inspection references.
71. Added test-record references.
72. Added decision references.
73. Added acceptance references.
74. Added installation-readiness gates.
75. Added inspection gates before acceptance.
76. Added decision gates before acceptance.
77. Added lifecycle regression for corrections.
78. Added visible hold status.
79. Added ready-for-review status.
80. Added recorded-decision status.

## Substitution, care and circularity

81. Added substitution-reason records.
82. Added substitution-equivalence evidence.
83. Added substitution evidence gates.
84. Added substitution counts.
85. Added interface review for substitutions.
86. Added maintenance planning.
87. Added cleaning planning.
88. Added repair planning.
89. Added spare-stock strategy.
90. Added replacement strategy.
91. Added disassembly planning.
92. Added reuse planning.
93. Added end-of-life planning.
94. Kept sustainability assertions evidence-dependent.

## Usability, access and verification

95. Added full-text material search.
96. Added lifecycle-stage filters.
97. Added visible review-gap counts.
98. Added keyboard-accessible native controls and 44px targets.
99. Added responsive single-column mobile editing.
100. Added tests for schema bounds, project portability, gates, summaries, and safety copy.

## Next review gates

- Unit and integration coverage exists for the portable model and stage gates.
- Browser accessibility and mobile parity are verified in the construction route before release.
- Product-specific evidence still requires provenance review; safety-critical selections require qualified professional review.

# Project planning — 100 implemented improvements

Status: `executable` (device-local planning records; professional and authority review gates remain external).

## Portfolio visibility (1–20)

1. Added a dedicated project-planning workspace. 2. Connected it to the integrated schedule. 3. Added live schedule event refresh. 4. Added a phase roadmap. 5. Added ordered phase numbering. 6. Added phase start dates. 7. Added phase finish dates. 8. Added duration-weighted phase progress. 9. Added per-phase activity counts. 10. Added per-phase blocked counts. 11. Added per-phase owner gaps. 12. Added per-phase evidence gaps. 13. Added accessible progress labels. 14. Added visual progress tracks. 15. Added a project activity pulse. 16. Added project blocker totals. 17. Added project assignment-gap totals. 18. Added schedule-missing guidance. 19. Added a direct schedule-planner jump. 20. Added automatic refresh after schedule edits.

## Scenario and look-ahead planning (21–40)

21. Added a what-if date-shift control. 22. Added negative shift exploration. 23. Added positive shift exploration. 24. Bounded scenario changes. 25. Added five-day increments. 26. Added a calculated working finish. 27. Kept scenario changes separate from the baseline. 28. Added an explicit scenario boundary. 29. Added a look-ahead view. 30. Added an editable anchor date. 31. Added 30-day planning. 32. Added 60-day planning. 33. Added 90-day planning. 34. Included activities intersecting a window. 35. Sorted look-ahead activities chronologically. 36. Added look-ahead status chips. 37. Added look-ahead phase context. 38. Added look-ahead responsibility context. 39. Added no-activity guidance. 40. Added visible window start and finish.

## Responsibility and readiness (41–60)

41. Added responsibility lanes. 42. Grouped work by role. 43. Added an explicit unassigned lane. 44. Highlighted unassigned work. 45. Added task counts by role. 46. Added scheduled-duration totals by role. 47. Added relative duration bars. 48. Added role-level blocker counts. 49. Clarified duration is not labor hours. 50. Added a phase readiness matrix. 51. Added role-readiness cells. 52. Added evidence-readiness cells. 53. Added dependency-readiness cells. 54. Added attention styling. 55. Added ready styling. 56. Added horizontally scrollable compact matrices. 57. Added semantic matrix articles. 58. Added color-independent readiness text. 59. Added concise blocker language. 60. Added deterministic rollup unit tests.

## Milestones and acceptance (61–80)

61. Added a milestone register. 62. Added milestone titles. 63. Added target dates. 64. Added milestone phases. 65. Added owner roles. 66. Added acceptance criteria. 67. Added evidence references. 68. Added planned status. 69. Added at-risk status. 70. Added ready-for-review status. 71. Added accepted status. 72. Prevented acceptance without evidence. 73. Prevented acceptance with incomplete minimum fields. 74. Added inline gap summaries. 75. Added milestone removal. 76. Added empty-state guidance. 77. Added role-not-person prompts. 78. Added responsive milestone cards. 79. Added milestone validation tests. 80. Added keyboard-reachable milestone controls.

## Decisions, portability and UX (81–100)

81. Added a decision log. 82. Added a risk log. 83. Added an assumption log. 84. Added a constraint log. 85. Added ownership for every log item. 86. Added due dates for every log item. 87. Added responses and next actions. 88. Added open status. 89. Added monitoring status. 90. Added closed status. 91. Added per-item removal. 92. Added open-item totals. 93. Added device-local persistence. 94. Added safe schema parsing. 95. Added record-count limits. 96. Added scenario-range validation. 97. Added portable JSON review export. 98. Added the workspace to project-package export/import. 99. Added mobile reflow and 44px controls. 100. Added an explicit professional, authority and contract review boundary.

## Next production gates

Authenticated shared editing requires project/member RLS, immutable approved baselines, audit history, notifications, resource-loaded scheduling, contract-time analysis, integration tests, accessibility automation, cross-device parity tests, and qualified project-controls review.

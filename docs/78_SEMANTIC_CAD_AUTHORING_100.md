# Semantic CAD authoring — 100 implemented improvements

Status: `executable` for a device-local conceptual authoring slice. These outcomes do not make mosque.build construction-ready CAD/BIM software.

## Canonical document and semantics (1–20)

1. Added a versioned CAD authoring schema.
2. Added a dedicated device-local storage key.
3. Added explicit metre units.
4. Added stable document identity.
5. Added committed revision numbers.
6. Added level identity.
7. Added level naming.
8. Added level elevation.
9. Added level height.
10. Added renderer-neutral two-dimensional points.
11. Added semantic wall records.
12. Added wall start and end placements.
13. Added wall thickness.
14. Added wall height.
15. Added wall type references.
16. Added wall phase states.
17. Added semantic opening records.
18. Added door, window and generic-opening kinds.
19. Added explicit opening-to-wall host relationships.
20. Added opening offset, width, height and sill properties.

## Spaces and starter model (21–35)

21. Added semantic space records.
22. Added mosque-specific space kinds.
23. Added explicit space boundary wall references.
24. Added working space-area values.
25. Added space-to-level relationships.
26. Added an empty document state.
27. Added a two-room starter document.
28. Added four perimeter walls to the starter.
29. Added a shared partition wall to the starter.
30. Added a hosted conceptual door.
31. Added a prayer-hall space.
32. Added a support-room space.
33. Added distinct starter space areas.
34. Added neutral conceptual type identifiers.
35. Kept all canonical records free of renderer objects.

## Command transactions and history (36–55)

36. Added semantic command records.
37. Added command identity.
38. Added command summaries.
39. Added bounded command payloads.
40. Added a load-starter command.
41. Added a move-wall-end command.
42. Added a resize-opening command contract.
43. Added a rename-space command contract.
44. Added uncommitted transaction state.
45. Added a separate preview document.
46. Added preview issue results.
47. Added explicit commit behavior.
48. Added explicit cancel behavior.
49. Kept cancel from mutating committed geometry.
50. Added committed revision increments.
51. Added bounded past revisions.
52. Added bounded future revisions.
53. Added undo across committed revisions.
54. Added redo across committed revisions.
55. Cleared redo history after a new commit.

## Validation and recovery (56–70)

56. Added duplicate element-ID detection.
57. Added finite coordinate validation.
58. Added wall-thickness bounds.
59. Added wall-height bounds.
60. Added minimum wall-length validation.
61. Added missing opening-host detection.
62. Added opening-width bounds.
63. Added opening-offset bounds.
64. Added opening-within-host validation.
65. Added broken space-boundary detection.
66. Added a no-spaces review prompt.
67. Prevented commits with blocking issues.
68. Added safe saved-state parsing.
69. Added wall, opening and space count limits.
70. Added history, future and selection count limits.

## Associative interface (71–88)

71. Added a dedicated semantic authoring studio.
72. Added a model tab.
73. Added an associative schedule tab.
74. Added a model-review tab.
75. Added an accessible SVG plan view.
76. Derived plan wall graphics from canonical walls.
77. Added plan-based wall selection.
78. Added color-independent selected-element state.
79. Added a semantic properties inspector.
80. Added wall ID inspection.
81. Added derived wall-length inspection.
82. Added wall-type inspection.
83. Added numeric endpoint editing.
84. Added explicit preview controls.
85. Added explicit commit controls.
86. Added explicit cancel controls.
87. Added disabled states for unavailable undo and redo.
88. Added live save and transaction announcements.

## Schedules, responsive UX and integration (89–100)

89. Added wall schedules derived from the visible document.
90. Added opening schedules derived from the visible document.
91. Added space schedule derivation in the domain layer.
92. Added horizontally safe schedule regions.
93. Added 44-pixel minimum interaction targets.
94. Added visible keyboard focus states.
95. Added narrow-mobile plan and inspector reflow.
96. Added safe-area-aware sticky transaction controls.
97. Added a clear conceptual-authoring boundary.
98. Added the CAD document to project package export and import.
99. Added the CAD authoring slice to the connected workflow.
100. Added deterministic domain, integration, accessibility and responsive-contract tests.

## Acceptance criteria met

- A user can author a finite wall from metre coordinates, preview endpoint/grid snapping, and commit or cancel without mutating the prior revision.
- Moving a joined endpoint keeps connected walls joined; deleting a wall removes its hosted openings and invalid boundary references.
- A user can host a door on a selected wall, while missing hosts and openings outside the host block commit with a plain-language issue.
- Wall, opening, and space schedules derive from the same visible semantic document, including an uncommitted preview.
- The committed semantic wall document drives the separate Three.js proxy view and remains free of renderer objects.
- Selection works by pointer and keyboard, controls retain 44-pixel targets, transaction actions respect safe areas, and narrow layouts reflow to one column.
- Saved state is bounded and validated before recovery; automated checks never claim structural, fire, accessibility, code, cost, or professional approval.

## Next gate

Add explicit closed-loop space authoring, opening cuts in wall proxy geometry, named wall and opening types, migration fixtures, and JSON/CSV user exports before beginning IFC mapping. IFC remains an exchange milestone, not a current capability.

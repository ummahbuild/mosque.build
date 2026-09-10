# Unified product UX — 100 implemented outcomes

Status: `executable`. These outcomes describe the shared journey and workspace conventions now implemented; they do not claim that every specialist tool is production-ready.

## One process

1. One six-stage journey is used across working pages.
2. Stage order is always Brief, Site, Design, Approve, Build, Care.
3. Every stage has one canonical destination.
4. Design and site work share one workspace entry.
5. Approval and resourcing are visibly one coordinated stage.
6. Operations is presented as Care rather than an endpoint.
7. My Project presents the whole journey without falsely selecting a stage.
8. Each specialist page identifies its current stage.
9. Current-stage state uses `aria-current="step"`.
10. Stage numbers remain visible alongside labels.
11. Previous-stage navigation is consistent.
12. Next-stage navigation is consistent.
13. The final stage returns to the project overview.
14. Page-local navigation uses consistent “Work here” language.
15. Coverage replaces vague feature-list navigation language.
16. Project foundation replaces inconsistent brief labels.
17. Journey context reflects the current workspace.
18. The same journey appears before specialist editors.
19. The journey is separate from marketing navigation.
20. Project progress no longer depends on the current page.

## Honest progress

21. Stage activity is derived from saved records.
22. Record presence is described as “started”.
23. Started work is never called complete.
24. A persistent note explains the completion boundary.
25. Empty stages show zero started records.
26. Stage counts update after project changes.
27. Stage counts update after cross-tab storage changes.
28. Event listeners are removed on unmount.
29. Unknown records cannot invent a new stage.
30. Workflow stages come from the canonical workflow model.
31. Stage destinations are explicitly mapped.
32. Overview mode avoids a misleading active stage.
33. The page context remains visible beside progress.
34. Past-stage styling means sequence only, not approval.
35. Current-stage styling is distinct from past-stage styling.
36. Unstarted future stages stay visually neutral.
37. Saved activity is framed as local project context.
38. Specialist review gates remain inside their tools.
39. Authority approval is not inferred from navigation.
40. Professional acceptance is not inferred from navigation.

## Editor orientation

41. Every ProductAreaPage receives the journey automatically.
42. Design receives the shared process without bespoke markup.
43. Marketplace receives the shared process without bespoke markup.
44. Construction receives the shared process without bespoke markup.
45. Operations receives the shared process without bespoke markup.
46. Permits now receives the same orientation as other pages.
47. Funding now receives the same orientation as other pages.
48. My Project now receives the same orientation as other pages.
49. Existing workspace-tool navigation remains available below it.
50. Product stage and page-local tool navigation have distinct labels.
51. The journey answers “where am I?” before an editor starts.
52. The current context answers “what am I working on?”.
53. Stage links answer “where do I go next?”.
54. Started counts answer “where is existing work?”.
55. Project overview answers “how does this connect?”.
56. Page anchors continue to use native links.
57. Stage links preserve shareable URLs.
58. Specialist page headings remain unchanged.
59. Existing editor state remains intact.
60. No domain model contains renderer objects.

## Mobile and responsive use

61. The journey changes from three columns to two rows on tablets.
62. Stages become horizontally scrollable on narrow screens.
63. Stage items use scroll snapping.
64. Each mobile stage retains a minimum readable width.
65. The current stage remains visible through strong contrast.
66. Previous and next controls remain available on mobile.
67. Redundant action text collapses on very small screens.
68. The page context truncates safely instead of overflowing.
69. The journey uses bounded page margins on tablet.
70. The journey uses tighter safe margins on phones.
71. Touch actions meet a 44-pixel minimum.
72. Horizontal scrolling is contained within the stage list.
73. Connector lines stay behind interactive content.
74. Counts remain readable without widening the page.
75. Mobile layout does not depend on hover.
76. Navigation remains usable at browser text zoom.
77. Labels use short mobile-friendly stage names.
78. Long canonical stage names remain in accessible labels.
79. The component avoids fixed heights.
80. The component avoids viewport-width overflow.

## Accessibility and interaction

81. The journey has an explicit navigation landmark label.
82. The stage sequence uses an ordered list.
83. Every stage is a real link.
84. Current location is programmatically exposed.
85. Previous links include full stage names in accessible labels.
86. Next links include full stage names in accessible labels.
87. Keyboard focus uses a high-contrast gold outline.
88. Focus is not communicated by color alone.
89. Progress connectors are non-interactive decoration.
90. Decorative stage numbers use semantic text rather than images.
91. No auto-advancing process animation is introduced.
92. No drag gesture is required for navigation.
93. Browser back and forward navigation remain functional.
94. Links work without client-side project data.
95. Server rendering provides the full stage structure.
96. Hydration only enriches started counts.
97. Empty or unavailable local storage degrades safely.
98. The control uses the existing mosque.build palette.
99. The design adds no unverified regulatory or religious claims.
100. Regression tests enforce process, semantics, focus and mobile behavior.

## Next review gates

- Run moderated mobile usability sessions across Brief → Design → Approval → Build handoffs.
- Progressively mount distant Three.js workspaces to reduce GPU pressure on low-powered devices.
- Standardize undo/history and explicit save feedback inside specialist editors.
- Add end-to-end tests for project export, restore, and stage-to-stage continuation.

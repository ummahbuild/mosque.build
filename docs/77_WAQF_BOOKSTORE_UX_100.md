# Waqf bookstore UX — 100 implemented outcomes

These outcomes describe executable interface, accessibility, performance and review-boundary behavior. Catalog records remain unreviewed acquisition candidates.

1. Render the first 24 matching books by default.
2. Show the displayed count separately from total matches.
3. Load the next 24 books on demand.
4. Offer an explicit show-all action.
5. Cap show-more at the filtered result total.
6. Reset result batching after search changes.
7. Reset result batching after language changes.
8. Reset result batching after subject changes.
9. Reset result batching after tier changes.
10. Reset result batching after madhhab changes.
11. Reset result batching after tradition changes.
12. Reset result batching after transliteration changes.
13. Reset result batching after favorites-only changes.
14. Reset result batching after sort changes.
15. Reset batching with all filters.
16. Provide a cover-grid view.
17. Provide a compact-list view.
18. Expose view controls as an accessible group.
19. Expose the active view with `aria-pressed`.
20. Keep view controls keyboard operable.
21. Preserve the chosen view while filtering.
22. Use one-column compact results.
23. Remove perspective from compact results.
24. Use a thumbnail cover in compact results.
25. Keep title metadata grouped in compact results.
26. Keep review details visible in compact structure.
27. Keep purchase actions aligned in compact structure.
28. Disable cover tilt in compact view.
29. Collapse compact view into cards on small screens.
30. Make mobile load-more actions full width.
31. Give load-more actions 46-pixel targets.
32. Provide visible hover feedback on load actions.
33. Remove load-action motion when requested.
34. Preserve 44-pixel catalog controls.
35. Preserve visible keyboard focus rings.
36. Preserve safe-area-aware side padding.
37. Prevent intrinsic select overflow.
38. Use zero-minimum grid columns.
39. Prevent horizontal page overflow.
40. Wrap view controls when space is constrained.
41. Keep filter controls non-sticky on small screens.
42. Stack result status and actions on phones.
43. Keep comparison controls inside the viewport.
44. Respect the bottom safe area for comparison.
45. Keep comparison limited to three books.
46. Disable a fourth comparison choice.
47. Allow comparison removal.
48. Allow comparison clearing.
49. Announce comparison as a labelled region.
50. Animate comparison entry when motion is allowed.
51. Disable comparison animation when motion is reduced.
52. Render category-specific cover palettes.
53. Render a visible book spine.
54. Render a page-edge treatment.
55. Render non-text geometric cover detail.
56. Keep decorative cover detail out of accessible text.
57. Balance long cover titles.
58. Retain language and stable ID on each cover.
59. Retain subject and acquisition tier on every card.
60. Retain author or compiler on every card.
61. Retain madhhab or scope context on every card.
62. Mark transliteration explicitly when supplied.
63. Keep edition details progressively disclosed.
64. Add a clear disclosure-state indicator.
65. Rotate the disclosure indicator when expanded.
66. Lift book cards on capable pointer devices.
67. Add restrained cover perspective on hover.
68. Trigger the same emphasis through focus-within.
69. Avoid hover-only behavior on coarse pointers.
70. Disable transforms under reduced motion.
71. Animate favorites only when motion is allowed.
72. Preserve favorite pressed state.
73. Give favorites an exact accessible label.
74. Persist favorites on the device.
75. Reject unknown persisted favorite IDs.
76. Deduplicate persisted favorite IDs.
77. Synchronize favorite counts across modules.
78. Synchronize favorites across browser tabs.
79. Enable favorite-only browsing.
80. Export favorites as a bounded JSON brief.
81. Export favorites as a CSV brief.
82. Disable exports when no favorites exist.
83. Include review flags in exports.
84. Include working quantities in exports.
85. Include edition-family fields in exports.
86. Include supplied source links in exports.
87. Mark exported briefs as conceptual.
88. Require scholarly review in exported briefs.
89. Avoid price and availability claims.
90. Keep seller links labelled as searches.
91. Open external searches safely.
92. Preserve publisher links only when supplied.
93. Search Unicode scripts without stripping their letters.
94. Normalize Latin diacritics for discovery.
95. Match every entered search term.
96. Search stable catalog identifiers.
97. Show a useful no-results recovery action.
98. Use content visibility for off-screen cards.
99. Reserve intrinsic size for deferred cards.
100. Verify the full catalog through automated tests.

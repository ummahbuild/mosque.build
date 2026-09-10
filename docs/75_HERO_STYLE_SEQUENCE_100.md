# Landing hero build and style sequence — 100 improvements

Status: `executable` locally. The hero is an illustrative navigation and comparison experience, not a design recommendation, historical reconstruction, construction model or approval.

## Sequence and state

1. Retained the eight-stage build sequence. 2. Added a post-completion showcase mode. 3. Made completion the automatic transition point. 4. Added a persistent active style index. 5. Kept build and style state separate. 6. Added automatic style cycling. 7. Added direct style selection. 8. Added direct construction-stage selection. 9. Style selection marks construction complete. 10. Stage selection returns to build mode.
11. Added replay-from-site control. 12. Replay resumes animation. 13. Manual selection pauses animation. 14. Pause works in both modes. 15. Play resumes the current mode. 16. Style cycling wraps safely. 17. Stage playback never skips completion. 18. Reduced-motion starts paused. 19. Reset view applies in both modes. 20. Active mode is exposed as component state.

## Design studies

21. Added a contemporary climate-led study. 22. Added a hypostyle repeatable-bay study. 23. Added a Maghrebi courtyard-system study. 24. Added a Swahili-coast threshold study. 25. Added an Ottoman-informed central-volume study. 26. Added a Mughal-informed garden-pavilion study. 27. Each study has unique massing. 28. Each study has a distinct roof strategy. 29. Each study has a distinct threshold strategy. 30. Each study has a contextual qualifier.
31. Contemporary massing uses low flexible volumes. 32. Contemporary massing uses a shaded threshold. 33. Contemporary marker remains optional in copy. 34. Hypostyle massing exposes repeated columns. 35. Hypostyle geometry emphasizes bay repetition. 36. Hypostyle copy mentions prayer-row continuity. 37. Hypostyle copy mentions phased expansion. 38. Maghrebi study uses a bounded court. 39. Maghrebi study uses surrounding volumes. 40. Maghrebi study uses a square marker.
41. Swahili study uses a compact enclosure. 42. Swahili study uses a deep veranda. 43. Swahili study uses a pitched roof. 44. Swahili copy mentions ventilated edges. 45. Central-dome study uses a dominant canopy. 46. Central-dome study uses supporting volumes. 47. Central-dome study uses a slender marker. 48. Garden-pavilion study uses a raised plinth. 49. Garden-pavilion study uses a bulb-like dome. 50. Garden-pavilion study uses balanced corner markers.

## Interface and accessibility

51. Added an explicit design-study control group. 52. Added visible active-button state. 53. Added active-dot reinforcement. 54. Added active caption wording. 55. Added style position count. 56. Preserved construction position count. 57. Added completed-stage styling. 58. Added a build-complete transition message. 59. Added contextual caption text. 60. Added style-specific detail text.
61. Added screen-reader style announcements. 62. Expanded the canvas accessible label. 63. Kept polite live-region behavior. 64. Used native buttons for every selector. 65. Used `aria-pressed` for style state. 66. Kept `aria-current` for construction state. 67. Preserved keyboard-operable range input. 68. Preserved keyboard focus on canvas. 69. Added forced-colors active-state treatment. 70. Preserved non-WebGL textual state.
71. Increased style-button tap targets to 44px. 72. Added mobile horizontal style scrolling. 73. Added mobile scroll snapping. 74. Prevented style labels from shrinking unreadably. 75. Allowed primary controls to wrap on mobile. 76. Added a three-column desktop selector. 77. Kept controls within the hero card. 78. Added a mode-specific background cue. 79. Kept caption contrast on both backgrounds. 80. Kept compact labels readable.

## Rendering, performance and trust

81. Reused one WebGL renderer. 82. Reused one scene. 83. Grouped construction geometry by phase. 84. Grouped alternatives by design study. 85. Shows only one style group at a time. 86. Hides the construction root in style mode. 87. Hides the style root in build mode. 88. Caps device pixel ratio. 89. Requests low-power rendering. 90. Reuses lightweight primitive geometry patterns.
91. Retained responsive resize observation. 92. Retained animation-frame cleanup. 93. Retained geometry disposal. 94. Retained material disposal. 95. Removes the renderer canvas during cleanup. 96. Avoids external model downloads. 97. Avoids unverified performance claims. 98. Labels styles as studies rather than replicas. 99. Requires lineage, climate and community review in boundary copy. 100. Keeps construction-progress and buildability disclaimers visible.

## Next gates

Future work should derive these display models from the renderer-neutral template records, add transition easing without undermining reduced-motion behavior, lazy-load geometry outside the initial viewport, add pointer orbit controls, and validate the studies with local cultural and architectural reviewers before any status promotion.

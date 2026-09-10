# CAD + BIM authoring development plan

Status: `specified` overall. Existing capabilities referenced below retain their current individual statuses; inclusion in this plan does not make a feature executable.

## Product objective

Evolve mosque.build from connected conceptual planning and Three.js inspection into an approachable, mosque-specific building authoring environment. The product should combine fast direct manipulation, typed building objects, associative views and schedules, disciplined option/revision management, and open exchange—without copying proprietary interfaces or pretending a browser model is construction-ready.

“oCreate” is interpreted here as **CoCreate / Creo Elements/Direct**, based on PTC’s current documentation for the former direct-modeling product family. That interpretation should be corrected if a different product was intended.

## Verified inspiration and what to adopt

| Source pattern | Verified lesson | mosque.build adaptation | Boundary |
|---|---|---|---|
| Creo Elements/Direct | Direct cut/paste, push/pull and drag/drop support rapid change and option exploration. | Previewable, cancelable direct edits on semantic building elements. | Do not treat mesh editing as canonical building truth. |
| Creo Elements/Direct | Packages, assemblies, parts, workplanes and environment settings separate model organization from view state. | Versioned project model, reusable mosque modules, workplanes and named authoring environments. | Use mosque.build schemas and open exchange, not proprietary file semantics. |
| Revit | Family categories and parameters control behavior, hosting, cutting, tagging and scheduling. | Typed mosque components with instance/type parameters, hosts, connectors and validation rules. | Avoid proprietary family-file compatibility claims. |
| Revit | Shared parameters support consistent tagging and multi-category schedules. | Governed property dictionaries with stable IDs, units, applicability and IFC mappings. | A property value is not verified merely because it is shared. |
| Revit | Design options and worksets organize alternatives and editing responsibility. | Branchable options plus discipline packages and explicit reservations in a future RLS-backed collaboration layer. | Local records are not multi-user worksharing. |
| Archicad | Interactive schedules are two-way views of model properties. | Associative schedules whose validated edits produce domain commands and model revisions. | Never bypass geometry or professional validation. |
| Archicad | Hotlinked modules update repeated building portions from a source module. | Reusable, version-pinned modules for wudu bays, prayer-row zones, classrooms and service cores. | Updates require preview, collision review and consent. |
| Archicad | Renovation status is saved with views and affects documentation. | Existing, demolition, temporary and new states linked to phases and saved views. | Status is a plan, not evidence of work completed. |
| buildingSMART IFC | IFC is an open international standard for BIM data exchange. | Target an explicit IFC release and exchange requirement; map canonical objects through an adapter. | IFC mapping does not establish model quality or regulatory acceptance. |

## Architecture decisions

1. **Canonical document model:** one renderer-neutral graph containing projects, sites, buildings, storeys, spaces, systems, elements, types, relationships, properties, phases, sources and review states.
2. **Command boundary:** every mutation is a validated semantic command with `preview → commit/cancel`, an inverse operation where possible, affected IDs, author role, timestamp and schema version.
3. **Geometry boundary:** canonical geometry uses explicit units, placements, profiles, paths, solids and relationships. Three.js remains a visualization and interaction adapter. A later exact-solid worker may use an evaluated open-source kernel after licensing, WebAssembly, performance and round-trip prototypes.
4. **Derived views:** plans, sections, elevations, schedules, quantities and Three.js scenes derive from the same revision and display staleness if regeneration fails.
5. **Component model:** types define shared behavior; instances hold placement and permitted overrides; hosts and connectors are explicit graph relationships.
6. **Collaboration:** device-local authoring comes first. Shared editing requires authentication, project/member RLS, server authorization, immutable revision history, leases/reservations and cross-tenant tests.
7. **Interchange:** glTF/GLB is render exchange; IFC is BIM exchange; BCF is the preferred future issue-exchange direction; GeoJSON/vector tiles remain mapping exchange.
8. **Truth:** geometry, quantities, checks and statuses always disclose source, maturity, confidence, exclusions and professional/authority review gates.

## 100-feature delivery backlog

### A. Authoring shell and interaction (1–10)

1. Add a unified authoring shell with model tree, canvas, properties, command bar and contextual inspector.
2. Add a command palette searchable by action, element type and project phase.
3. Add preview, commit and cancel states for every geometry-changing command.
4. Add keyboard-first selection, command confirmation and escape-to-cancel behavior.
5. Add point, window, crossing-window and lasso selection modes.
6. Add additive, subtractive, inverse and saved selection sets.
7. Add hover preselection with semantic element name and host context.
8. Add context-sensitive mini tools beside the active selection without covering geometry.
9. Add touch-safe transform handles and numeric entry suitable for tablets.
10. Add command error recovery that preserves the last valid model revision.

### B. Sketches, constraints and workplanes (11–20)

11. Add named horizontal, vertical, face-hosted and offset workplanes.
12. Add line, rectangle, polygon, arc, circle, spline and reference-line sketch entities.
13. Add endpoint, midpoint, center, quadrant, intersection, perpendicular, tangent and extension snaps.
14. Add temporary dimensions during drawing and movement.
15. Add persistent linear, angular, radial, ordinate and level dimensions.
16. Add horizontal, vertical, parallel, perpendicular, tangent, concentric, equal and coincident constraints.
17. Add locked dimensions with dependency-aware change previews.
18. Add under-constrained, fully constrained, conflicting and redundant constraint diagnostics.
19. Add construction geometry excluded from quantities and exchange by default.
20. Add sketch profiles that can safely drive walls, floors, roofs, openings and zones.

### C. Direct and parametric geometry (21–30)

21. Add move, rotate, mirror, copy, array, align, offset and scale commands with numeric deltas.
22. Add push/pull edits that translate faces into semantic parameter changes when possible.
23. Add profile extrusion, path sweep, revolve and loft descriptors in the canonical geometry layer.
24. Add boolean union, difference and intersection as professionally bounded conceptual operations.
25. Add fillet, chamfer, shell and draft studies behind an exact-kernel feasibility gate.
26. Add face-offset and thickness edits with minimum-geometry validation.
27. Add multi-element transforms preserving host and connector relationships.
28. Add edit-in-place mode with a clear breadcrumb back to the full mosque model.
29. Add direct-edit fallback records for imported geometry that cannot map to native parameters.
30. Add deterministic geometry tolerances and unit-aware validation fixtures.

### D. Native building objects (31–40)

31. Add authored wall paths with type, thickness, height, joins, layers and phase state.
32. Add slabs and floors from closed profiles with openings, slopes and finish zones.
33. Add roofs from footprint, extrusion and face definitions with ridges, valleys, eaves and drainage.
34. Add columns, beams, braces and structural grids with analytical-reference placeholders.
35. Add hosted doors, windows, gates and screens with clear-opening and operation properties.
36. Add stairs, ramps, landings, rails and route relationships with accessible-review gates.
37. Add ceilings and reflected-ceiling objects linked to lights, diffusers, speakers and access panels.
38. Add shafts, voids, penetrations and sleeves coordinated across hosts and disciplines.
39. Add terrain surfaces, pads, roads, paths, parking bays, kerbs and drainage paths.
40. Add zones for fire, acoustics, thermal, daylight, privacy, safeguarding and operations studies.

### E. Mosque-specific intelligent components (41–50)

41. Add a qibla datum that drives prayer orientation without silently rotating the whole building.
42. Add prayer-row zones with alignment, spacing, accessible positions and obstruction checks.
43. Add mihrab assemblies with host, access, speech, daylight, material and content-review properties.
44. Add minbar assemblies with route, step, guard, visibility, storage and review parameters.
45. Add wudu-bay modules with fixture, clear-space, wet-zone, drainage and maintenance connectors.
46. Add women’s prayer-space modules with equitable routes, amenity parity and consultation records.
47. Add ablution, washroom, janazah, kitchen, classroom, daycare and madrasa room kits.
48. Add dome, minaret, arcade, courtyard, screen and ornamental assembly types with cultural provenance.
49. Add shoe storage, donation box, display, audio, library and movable-partition equipment types.
50. Add mosque event modes that reconfigure validated movable elements without changing base geometry.

### F. Types, properties and reusable modules (51–60)

51. Add governed element categories and type catalogs with stable, non-proprietary identifiers.
52. Add type parameters, instance parameters, formulas, units, bounds and permitted overrides.
53. Add shared property definitions usable across categories and schedules.
54. Add parameter provenance, observed date, confidence, review status and exclusions.
55. Add host rules for wall, face, level, workplane, room and free-standing components.
56. Add semantic connectors for water, waste, power, data, airflow, structure and circulation.
57. Add nested components that remain independently selectable and schedulable when declared shared.
58. Add reusable mosque modules with source version, insertion point, transform and dependency manifest.
59. Add module-update previews showing additions, removals, moves, property changes and conflicts.
60. Add type and module migration tools that never overwrite unresolved local overrides.

### G. Associative documentation and quantities (61–70)

61. Add revision-linked floor plans generated from canonical elements.
62. Add live sections and elevations with adjustable cut planes and depth ranges.
63. Add detail and callout references that retain parent-view relationships.
64. Add annotation types for dimensions, tags, room labels, levels, grids, symbols and keynotes.
65. Add governed drawing scales, line weights, fills, hatches and visibility rules.
66. Add associative multi-category schedules with validated two-way property editing.
67. Add room, door, window, finish, fixture, equipment and material schedules.
68. Add quantity takeoffs exposing geometric basis, exclusions, rounding and stale-revision warnings.
69. Add sheet, title-block, viewport and issue-set records with revision status.
70. Add PDF/SVG drawing publication only from named, frozen, reviewable model revisions.

### H. Options, phasing and collaboration (71–80)

71. Add branchable design options with shared baseline, scoped differences and comparison views.
72. Add option promotion through explicit review instead of destructive replacement.
73. Add existing, demolition, temporary and new phase states for every applicable element.
74. Add phase filters saved with plans, sections, schedules, quantities and Three.js views.
75. Add renovation and phased-occupancy scenarios for conversions and mosque expansion.
76. Add discipline packages for architecture, structure, civil, systems, interiors and operations.
77. Add future RLS-backed element reservations with expiry, release and administrator recovery.
78. Add model-difference views by author, discipline, revision, option and phase.
79. Add review requests, comments and issues linked to stable element and viewpoint IDs.
80. Add offline change packages with preview, collision detection and non-destructive reconciliation.

### I. Coordination, analysis and delivery (81–90)

81. Add broad-phase and exact clash pipelines separating geometry conflicts from review rules.
82. Add clearance, access, maintenance, door-swing, headroom and service-zone checks.
83. Add system connectivity checks for water, drainage, electrical, fire, data and ventilation graphs.
84. Add model-linked permit, code and authority questions labelled likely applicable until verified.
85. Add element-linked low, base and high cost lines with geography, currency, date and provenance.
86. Add model quantities and assemblies to procurement requirements without inventing products or availability.
87. Add element-to-schedule activity links for construction sequencing and status visualization.
88. Add temporary works, hold points, inspections and evidence gates to construction model states.
89. Add asset tags, commissioning requirements, manuals and maintenance plans before handover.
90. Add operational scenario views for prayer, education, events, emergency and utility outages.

### J. Exchange, reliability and production hardening (91–100)

91. Select and document a target IFC release, model-view requirement and supported exchange subset.
92. Add stable IFC GUID strategy, spatial hierarchy, classifications and property-set mappings.
93. Add IFC export fixtures and round-trip comparison tests before user-facing export claims.
94. Add BCF-compatible issue and viewpoint mapping after stable element identity is proven.
95. Add glTF/GLB export with semantic IDs, units, origin, materials and revision metadata.
96. Add worker-based geometry generation, cancellation and progressive model loading.
97. Add large-model budgets for memory, frame time, selection latency and derived-view generation.
98. Add corruption recovery, schema migrations, checksums and immutable revision snapshots.
99. Add accessibility, keyboard, touch, mobile/web parity, visual-regression and browser-matrix tests.
100. Add production gates for security/RLS, privacy, provenance, professional review, IFC validation and construction-use disclaimers.

## Delivery sequence

| Release | Outcome | Backlog | Status target |
|---|---|---:|---|
| 1. Authoring foundation | Canonical commands, sketches, selection and reversible direct edits | 1–30 | `executable` locally |
| 2. Building model | Native building and mosque-specific objects | 31–60 | `executable` locally |
| 3. Documents + options | Associative views, schedules, quantities, options and phases | 61–75 | `beta` after professional review |
| 4. Coordination | Discipline packages, issues, clash, cost, schedule and handover | 76–90 | `beta` after integration review |
| 5. Open exchange | Validated IFC/BCF/glTF pipelines and production hardening | 91–100 | status advanced per feature only |

## First executable slice

The first build should not begin with booleans or IFC export. Implement a narrow vertical slice:

1. Canonical wall, opening and space types with stable IDs and placements.
2. Semantic `create`, `select`, `move`, `resize`, `host`, `undo` and `redo` commands.
3. Preview/commit/cancel transaction state with deterministic validation.
4. One synchronized plan view, one Three.js view, one properties inspector and one door schedule.
5. Golden tests proving all views and schedules derive from the same committed revision.
6. Project-package migration, responsive keyboard/touch interaction and explicit professional boundary.

Exit criteria: a user can draw two connected rooms, place a hosted door, change a dimension numerically, undo the edit, and see the same committed result in plan, 3D, properties and schedule—without renderer objects entering the domain model.

## Required testing and review

- Unit: commands, inverse commands, constraints, tolerances, hosts, connectors, quantities and migrations.
- Integration: plan/3D/schedule synchronization, project export, options, phases, cost, schedule and construction handoff.
- Exchange: schema validation, known IFC fixtures, round trips, stable identity and declared information loss.
- Security: hostile imports, resource exhaustion, prototype pollution, authorization and RLS isolation.
- Accessibility: keyboard-only authoring, focus, screen-reader property editing, non-color state and reduced motion.
- Performance: large-model budgets on representative mobile and desktop devices.
- Human gates: architecture, structure, civil, MEP, fire, accessibility, cost, construction, facilities, cultural and religious review.

## Sources and provenance

Observed 2026-09-10. These are product-design references, not licenses to copy user interfaces, assets, terminology or proprietary formats.

- PTC, [Creo Elements/Direct Modeling Express](https://support.ptc.com/products/creo-elements-direct/modeling-express/) — direct editing and rapid option exploration; official product page; rights retained by PTC; confidence `high`.
- PTC, [Creo Elements/Direct Modeling help](https://support.ptc.com/help/creo/ced_modeling/r20.8.0.0/en/ced_modeling.html) — workplanes, selection, direct operations, annotations and model organization; official documentation; rights retained by PTC; confidence `high`.
- PTC, [File types overview](https://support.ptc.com/help/creo/ced_modeling/r20.8.0.0/en/ced_modeling/OSDM_Main/Files_Types.html) — packages, assemblies/session/environment separation; official documentation; confidence `high`.
- Autodesk, [Family category and parameters](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-Customize/files/GUID-68EFCA67-4913-4E00-AB9E-F2E6A7BEF8C6.htm) — hosted behavior, cutting and shared nested components; official documentation; rights retained by Autodesk; confidence `high`.
- Autodesk, [Shared parameters](https://help.autodesk.com/cloudhelp/2024/ENU/Revit-Model/files/GUID-E7D12B71-C50D-46D8-886B-8E0C2B285988.htm) — cross-category properties, tags and schedules; official documentation; confidence `high`.
- Autodesk, [Planning worksets](https://help.autodesk.com/cloudhelp/2026/ENU/Revit-Collaborate/files/GUID-6054CEF3-C4E6-4334-BA43-568DF5DF5702.htm) — discipline-oriented editing and visibility organization; official documentation; confidence `high`.
- Graphisoft, [Interactive Schedule](https://help.graphisoft.com/AC/26/INT/_AC26_Help/050_ViewsVB/050_ViewsVB-89.htm) — model-linked, two-way schedules; official documentation; rights retained by Graphisoft; confidence `high`.
- Graphisoft, [Hotlinked Modules](https://help.graphisoft.com/AC/18/INT/AC18Help/05_Collaboration/05_Collaboration-64.htm) — reusable and updateable repeated modules; official documentation; confidence `high`.
- Graphisoft, [Renovation](https://help.graphisoft.com/AC/26/INT/_AC26_Help/050_ViewsVB/050_ViewsVB-119.htm) — element renovation states and view filters; official documentation; confidence `high`.
- buildingSMART, [IFC 4.3 documentation](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/content/introduction.htm) — open BIM exchange scope and definitions; official standard documentation; rights per buildingSMART publication terms; confidence `high`.

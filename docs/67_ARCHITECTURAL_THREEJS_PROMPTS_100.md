# 100 architectural design and planning prompts for Three.js

These are implementation prompts, not delivered-feature claims. Keep canonical project objects renderer-neutral; Three.js is a disposable view and interaction adapter. Preserve glTF/GLB and IFC exchange paths, accessibility, mobile parity, deterministic tests, provenance, and explicit professional or cultural review gates. Geometry is conceptual until verified by accountable qualified professionals. Do not generate sacred calligraphy as decorative filler.

## Spatial model foundation

1. Build a renderer-neutral level-and-grid editor whose Three.js adapter shows named axes, storeys, elevations, offsets, and user-recorded verification status.
2. Add direct-manipulation room volumes with numeric width, depth, height, elevation, and rotation fields that remain synchronized without making scene objects canonical.
3. Create snapping modes for grid, endpoint, midpoint, face, perpendicular, parallel, and entered module size, with keyboard-accessible toggles and visible snap reasons.
4. Add temporary dimensions between selected points, faces, rooms, openings, and site elements, clearly labeled as conceptual unless tied to verified survey evidence.
5. Implement plan, reflected-ceiling, elevation, section, axonometric, and perspective cameras with saved renderer-neutral view records.
6. Add named model views with layer visibility, camera target, clipping planes, issue filters, and author notes that can be exported in project packages.
7. Build multi-select, box-select, isolate, hide, reveal, lock, unlock, duplicate, align, distribute, mirror, and array interactions with undo and redo.
8. Add a command history that records semantic project mutations rather than Three.js object changes and survives a page refresh.
9. Create option branches so teams can compare massing, circulation, roof, façade, courtyard, and phase alternatives without overwriting the base scheme.
10. Add model-origin and coordinate-basis controls that keep anonymous local coordinates separate from surveyed or georeferenced data.

## Rooms, worship, and circulation

11. Generate editable prayer-row guides from the recorded qibla basis, room boundary, column interruptions, row module, and accessible-position intent.
12. Add a prayer-row interruption inspector that highlights columns, doors, level changes, furniture, and circulation conflicts without claiming religious or code compliance.
13. Build capacity scenarios from user-entered row assumptions and expose every excluded area, tolerance, and review dependency.
14. Create a qibla-wall coordination layer for mihrab study zones, minbar access, imam circulation, teaching positions, AV, lighting, and service penetrations.
15. Add a procession and arrival-path editor using renderer-neutral polylines for street-to-entry, entry-to-shoes, shoes-to-wudu, and wudu-to-prayer journeys.
16. Visualize public, transition, quiet, controlled, service, and private spatial gradients with a color-blind-safe overlay and text legend.
17. Add path comparison for women, disabled worshippers, elders, children, new Muslims, staff, visitors, and emergency responders without assuming one preferred route.
18. Build a turning-and-maneuvering study tool using user-entered dimensions and jurisdiction evidence rather than embedded universal compliance claims.
19. Add threshold annotations for surface change, slope, drainage, door operation, weather protection, lighting, seating, and wayfinding review.
20. Create a crowd-flow scenario playback from user-entered origins, destinations, arrival windows, and assumptions, labeled as planning visualization rather than simulation proof.

## Site and landscape

21. Build an editable site terrain surface from imported or entered points while retaining source, date, accuracy, coordinate basis, and survey status.
22. Add cut-and-fill comparison geometry that reports conceptual volumes only and requires geotechnical, survey, drainage, and civil review.
23. Create setback, easement, right-of-way, protected-tree, utility, heritage, and no-build overlays that require jurisdiction-specific provenance.
24. Add pedestrian, bicycle, transit, shuttle, drop-off, service, refuse, funeral, and fire-access route layers with conflict markers.
25. Build parking-bay and aisle layout tools with accessible-space, electric-vehicle, bicycle, motorcycle, bus, overflow, and event-mode studies.
26. Add terrain-aware route gradients with rest-point, cross-slope, weather exposure, lighting, and drainage questions for complete accessible journeys.
27. Create courtyard layout tools for shaded circulation, gathering, play, teaching, planting, water stewardship, maintenance access, and emergency use.
28. Add tree-canopy growth scenarios with entered species data, mature dimensions, root protection, irrigation, shade, leaf litter, and maintenance evidence.
29. Visualize surface permeability, rain gardens, swales, storage, exceedance routes, and discharge points without calculating authority acceptance.
30. Build site phasing views that preserve worship access, construction separation, temporary utilities, emergency access, deliveries, and neighbor impacts.

## Climate, daylight, and energy

31. Add solar-path visualization based on a privacy-safe project climate reference and expose source, date, timezone, north basis, and model limitations.
32. Create hourly and seasonal shadow studies for roofs, courtyards, entrances, prayer halls, parking, play areas, photovoltaic zones, and neighboring sensitivity.
33. Build façade solar-exposure maps that compare orientation, opening ratio, screen depth, overhangs, reveal geometry, and user-entered weather data.
34. Add daylight aperture studies using simplified sky models, with clear separation from validated daylight calculations and certification results.
35. Create glare-risk viewpoints for imam, worshippers, readers, screen users, drivers, and neighbors, requiring specialist validation.
36. Add natural-ventilation path diagrams connecting inlets, outlets, atria, courtyards, stack zones, obstructions, acoustic needs, security, and rain protection.
37. Build heatwave operating-mode scenes showing shaded arrival, cool refuge, safe ventilation, backup power, drinking water, and reduced-occupancy strategies.
38. Create flood and intense-rain scenarios showing user-entered water levels, safe access, protected equipment, sacrificial zones, recovery routes, and evidence gaps.
39. Add severe-wind review overlays for roof edges, domes, parapets, screens, canopies, gates, signs, trees, temporary works, and inspection access.
40. Build embodied-impact comparison hooks that attach declared product data, geography, date, service life, replacement, transport, and end-of-life evidence to model assemblies.

## Envelope, roofs, and structure

41. Create editable wall assemblies with layers, thicknesses, openings, movement joints, interfaces, replaceability, and evidence references rendered as section cutaways.
42. Add flat, mono-pitch, gable, hip, butterfly, barrel-vault, dome, and hybrid roof generators driven by portable form parameters.
43. Build roof-drainage path visualization for falls, valleys, gutters, outlets, overflows, scuppers, storage, safe discharge, blockages, and maintenance routes.
44. Add dome geometry controls for spring line, diameter, rise, drum, oculus study, support ring, segmenting, cladding module, access, and acoustic review.
45. Create roof-zone conflict checks for drainage, photovoltaic arrays, smoke control, plant, lightning protection, maintenance walkways, fall protection, and structure.
46. Add conceptual structural grids, spans, support zones, transfer conditions, movement joints, lateral-system zones, and load-path annotations without sizing members.
47. Visualize foundation option zones against entered ground layers, groundwater observations, trees, drainage, utilities, adjacent structures, and investigation gaps.
48. Build a vertical-load-path trace from roof surface through supports to foundation zones, showing missing relationships rather than calculating capacity.
49. Add lateral-stability review views for diaphragms, bracing, cores, frames, masonry walls, roof discontinuities, domes, canopies, and expansion joints.
50. Create construction-tolerance envelopes around structure, façades, openings, services, finishes, and crafted elements with collision warnings.

## Gates, openings, façades, and ornament

51. Build parametric pedestrian and vehicle gate previews with frame, leaf, track, hinge, opening sweep, manual release, access control, and entrapment-review zones.
52. Add door-clearance and maneuvering overlays tied to recorded jurisdiction evidence, hardware operation, threshold, approach, and accessible-route intent.
53. Create façade bay editing with columns, infill, openings, screens, shading, material modules, joints, corners, parapets, and phase boundaries.
54. Build ornamental-screen generators for project-authored polygon, star, lattice, interlace, and modular rhythms with bounded panels and explicit authorship.
55. Add open-area, sightline, privacy, shade, airflow, cleaning-access, edge, fixing, replacement-module, and fabrication-tolerance views for screens.
56. Create pattern-to-surface mapping that resolves borders, corners, openings, terminations, movement joints, datum changes, and partial modules.
57. Add carved-stone, timber-joinery, ceramic-module, cut-metal, cast-panel, plaster-relief, textile, and digital-fabrication study adapters with no invented performance.
58. Build door-panel and gate-panel studies that keep ornamental geometry separate from fire, security, egress, accessibility, weather, and hardware records.
59. Create full-scale virtual mockup mode with a human-height reference, material sample IDs, lighting presets, viewing distances, fabrication notes, and review comments.
60. Add cultural-context comparison showing linked precedent, source, region, period, design lesson, cautions, authorship, rights, and local-review status beside the model.

## Islamic architectural studies

61. Build an arcade-bay study for column spacing, arch profile, spring line, clear route, prayer-row coordination, structure, acoustics, lighting, and expansion.
62. Create a courtyard-and-iwan massing study focused on hierarchy, thresholds, shade, acoustics, circulation, climate, capacity, and phaseability rather than motif copying.
63. Add hypostyle planning tools for repeated bays, complete prayer rows, column visibility, structure, fire, services, timber care, and incremental expansion.
64. Build a muqarnas briefing generator as nonstructural specialist geometry with transition volume, module hierarchy, access, fire, lighting, dust, cleaning, and fabrication gates.
65. Create mashrabiya and jali screen studies that compare daylight, ventilation, privacy, view, maintenance, weathering, structure, craft, and regional context.
66. Add zellij and modular tile planning with substrate, waterproofing, setting-out, cut modules, borders, joints, corners, replacement stock, slip, and cleaning review.
67. Build timber-ceiling rhythm studies coordinating structure, acoustics, lighting, sprinklers, detectors, access panels, fire treatment, moisture, insects, and craft repair.
68. Create a minaret-or-call-to-prayer element study limited to massing, access, maintenance, structure, wind, lightning, acoustics, planning, and community review—never presumed necessity.
69. Add mihrab and minbar spatial studies that avoid prescribing a universal form and coordinate dignity, access, teaching, sightlines, acoustics, safety, and local religious review.
70. Build an inscription-zone placeholder system that stores only boundaries, responsible roles, rights, and review status while never generating sacred text.

## Interiors and operations

71. Create prayer-carpet layout geometry for row modules, roll widths, seams, columns, accessible positions, high-wear replacement zones, thresholds, and cleaning paths.
72. Add furniture and equipment placement for shelving, seating, lecterns, donation boxes, displays, screens, storage, teaching furniture, and assistive listening.
73. Build reach-range and obstruction review overlays for donation boxes, switches, shelves, displays, controls, shoe storage, dispensers, and service points.
74. Create women’s-space option scenes comparing equal-quality arrival, prayer, wudu, learning, family support, audio, sightlines, privacy choices, and participation.
75. Add family, quiet, sensory-support, nursing, first-aid, safeguarding, and counseling room studies with anonymous user journeys and operational review.
76. Build wudu-area geometry for dry arrival, shoe transition, standard and accessible positions, partitions, drainage, splash, grab-support study, seating, and service access.
77. Visualize wet/dry separation, slip-risk evidence zones, falls, drainage paths, waterproofing extents, ventilation, cleaning equipment, and out-of-service routes.
78. Create acoustic zoning for prayer, khutbah, classrooms, community halls, plant, kitchens, children, courtyards, partitions, and assistive-listening positions.
79. Add lighting layers for ambient, task, accent, emergency, exterior, cleaning, broadcast, low-glare, controls, daylight response, and maintenance access.
80. Build room operating-mode presets for daily prayer, Friday, Ramadan, Eid, funeral, school, community event, food service, shelter, maintenance, and partial closure.

## Construction, BIM, and coordination

81. Add construction-sequence playback from portable activities, dependencies, zones, hold points, temporary works, inspections, evidence, and user-recorded status.
82. Create partial-build states showing safe worship access, temporary enclosure, weather protection, emergency routes, utilities, dust, noise, and public separation.
83. Build a four-dimensional lookahead view for active work, constraints, materials, inspections, decisions, deliveries, crews, equipment, and unresolved evidence.
84. Add model-linked issues with viewpoint, screenshot, element IDs, discipline, severity, owner role, due date, evidence, resolution, and audit history.
85. Create model comparison that detects added, removed, moved, resized, reclassified, or relinked canonical objects between saved project snapshots.
86. Build an IFC mapping inspector for spaces, slabs, walls, roofs, openings, stairs, ramps, systems, furnishings, assemblies, classifications, properties, and unresolved mappings.
87. Add glTF/GLB export with stable IDs, semantic extras, units, origin, coordinate basis, visible layers, option ID, provenance, and conceptual-use notice.
88. Create quantity takeoff views that derive only from entered geometry and retain units, formula, exclusions, waste assumptions, maturity, geography, currency, date, and source links.
89. Build procurement handoffs from selected model assemblies to performance briefs, samples, alternates, lead-time evidence, landed cost, installation, spares, and care.
90. Add handover-mode visualization linking assets to commissioning, warranties, manuals, training, inspection access, isolation, replacement zones, and work orders.

## Accessibility, resilience, and production quality

91. Provide complete keyboard control for selection, camera views, isolation, clipping, measurement, issue creation, undo, redo, and escape, with an onscreen shortcut guide.
92. Add screen-reader model summaries describing visible levels, rooms, routes, assemblies, selected object properties, checks, and evidence gaps without requiring the canvas.
93. Build mobile editing patterns with bottom sheets, large tap targets, numeric steppers, reduced canvas gestures, safe-area padding, orientation recovery, and offline persistence.
94. Add reduced-motion mode that disables damping, autoplay, animated transitions, pulsing highlights, and camera flights while preserving all functions.
95. Create color-blind-safe themes and noncolor encodings for selected, hidden, warning, blocked, review, source-backed, and professionally reviewed user records.
96. Add WebGL capability detection, context-loss recovery, low-power geometry budgets, adaptive pixel ratio, progressive loading, and a useful non-WebGL plan fallback.
97. Build deterministic geometry tests for finite values, bounds, overlaps, broken references, duplicate IDs, invalid topology, missing provenance, and unsafe status promotion.
98. Add browser tests at compact phone, large phone, tablet, laptop, and wide desktop sizes covering model loading, editing, persistence, export, focus, overflow, and context recovery.
99. Create performance budgets for initial JavaScript, Three.js lazy loading, draw calls, triangles, materials, textures, GPU memory, interaction latency, and disposal after navigation.
100. Build a model-readiness dashboard that separates concept, specified, scaffolded, executable, source-backed, beta, and production-ready records and lists the exact evidence or human review required for each promotion.

## Definition of ready for implementation

Every selected prompt should declare its canonical schema, renderer adapter, storage and migration plan, unit and integration tests, accessibility and mobile tests, source/provenance checks, failure and empty states, export behavior, performance budget, and required professional, authority, community, cultural, or religious review gates.

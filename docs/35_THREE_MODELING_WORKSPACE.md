# Three.js modeling workspace

Status: **scaffolded**

The design page now derives both its dimensioned SVG and interactive WebGL massing from the portable `SchematicPlan`. `render-model.ts` is the renderer-neutral scene contract; `three-scene-adapter.ts` is the replaceable Three.js translation boundary.

Implemented: orbit/pan/zoom, isometric/top/elevation views, responsive high-DPI rendering, live plan synchronization, pointer and keyboard-accessible room selection, a semantic property inspector, exploded-volume and edge studies, locally saved viewpoints, PNG and GLB export, WebGL failure messaging, and explicit GPU/resource cleanup.

Selected architecture studies now enter the renderer as analytical guides with provenance and cautions. Hypostyle studies create bay-coordination guides, courtyard lineages create axis and proportion guides, and centralized-volume studies create a coordination ring. These are deliberately not columns, iwans, domes, replicas, structural geometry, or claims of regional authenticity. Compatible shortlisted patterns are shown as contextual records rather than automatically mapped textures.

The model-quality panel now checks schema version, stable IDs, footprint containment, valid dimensions, room overlap, area reconciliation, analytical guides, measurement evidence, linked cultural context and the professional review gate. Results are filterable and export as a versioned JSON report. These deterministic checks catch coordination defects; they do not establish code compliance or design adequacy.

Selected construction assembly studies now travel into the renderer and GLB as sorted semantic IDs. The design workspace exposes each study's evidence requirements, care plan, source date and maturity. It deliberately does not turn a conceptual assembly selection into rendered thickness, certified performance, price, availability or approval.

The output is conceptual visual exchange—not BIM, structure, MEP, fire analysis, code compliance, cost, or construction documentation. GLB user data retains schema, units, status and the professional review gate.

Next implementation slices:

1. Add renderer-neutral openings, walls, levels and adjacency constraints with deterministic geometry tests.
2. Add point-to-point measurement and editable transform controls with undo/redo.
3. Add section cut, exploded phases, sunlight studies driven by user-supplied location/date, and saved viewpoints.
4. Add IFC import/export behind an isolated adapter, validation report and provenance record.
5. Add clash and accessibility checks only where rules, jurisdiction, assumptions and qualified review are explicit.

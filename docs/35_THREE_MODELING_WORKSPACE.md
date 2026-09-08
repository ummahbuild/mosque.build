# Three.js modeling workspace

Status: **scaffolded**

The design page now derives both its dimensioned SVG and interactive WebGL massing from the portable `SchematicPlan`. `render-model.ts` is the renderer-neutral scene contract; `three-scene-adapter.ts` is the replaceable Three.js translation boundary.

Implemented: orbit/pan/zoom, isometric and top views, responsive high-DPI rendering, live plan synchronization, an accessible room schedule, GLB export, WebGL failure messaging, and explicit GPU/resource cleanup.

The output is conceptual visual exchange—not BIM, structure, MEP, fire analysis, code compliance, cost, or construction documentation. GLB user data retains schema, units, status and the professional review gate.

Next implementation slices:

1. Add selectable objects, semantic properties, measurements and keyboard selection.
2. Add renderer-neutral openings, walls, levels and adjacency constraints with deterministic geometry tests.
3. Add section cut, exploded phases, sunlight studies driven by user-supplied location/date, and saved viewpoints.
4. Add IFC import/export behind an isolated adapter, validation report and provenance record.
5. Add clash and accessibility checks only where rules, jurisdiction, assumptions and qualified review are explicit.

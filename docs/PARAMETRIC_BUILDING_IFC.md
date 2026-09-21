# Dimensioned mosque building studies and IFC exchange

Status: `executable`. Entry point: `/design#building-geometry`. Introduced 2026-09-21.

## User workflow

1. Choose a hall, courtyard, veranda or central-volume starting point. The six presets share IDs with the existing mosque template catalog. Its **Edit building geometry** link carries the selection into the dimension editor.
2. Review the attributed precedent photograph and enter project dimensions. Images are visual references; this feature does not infer dimensions, reconstruct a surveyed building, or generate native Revit families from photographs.
3. Apply dimensions to regenerate the plan and model together. Invalid dimensions cannot replace the last valid model. Changing a preset retains entered dimensions and observations.
4. Load 3D on demand, inspect elements, switch perspective/top views and remove roofs to inspect the interior. The HTML element selector provides keyboard access to the same selection. The plan and export tools work without WebGL.
5. Save locally, restore an editable JSON file, or include the saved study in the existing project package.
6. Seed an **empty** floor-plan workspace with the hall, arrival, courtyard and hosted openings. Existing rooms, openings, annotations or multiple levels prevent replacement. Subsequent changes are independent; there is no hidden two-way synchronization. The existing floor-plan window model lacks sill elevation, so a handoff note records the 1.2 m sill assumption.
7. Export IFC4 for independent BIM review, or GLB for visualization. Export uses applied geometry even if the form contains unapplied edits; the UI identifies that state. GLB includes roofs even when hidden for inspection.

## Geometry and exchange contract

- Canonical coordinates: metres, X/Y plan, Z elevation, local origin. No geolocation or site/qibla bearing is inferred.
- Domain: `apps/web/lib/parametric-building.ts`; renderer: `apps/web/components/parametric-building-view.tsx`.
- Walls, slabs, columns, arches and pitched roofs are extruded polygon profiles. Walls contain real gaps for openings; opening elements retain host IDs.
- Dome: closed oriented faceted shell, shared vertices, inner and outer surfaces, springing annulus. Roof deck has a matching aperture. Shell thickness is a geometric parameter, not an engineered specification or a constant normal-thickness claim.
- Pitched roofs include gable infill. Courtyard and arrival slabs are separate objects. Arcades have columns, curved arch bands and spandrels; profiles are original schematic geometry, not measured heritage reproductions.
- IFC writer: `apps/web/lib/building-ifc.ts`. IFC4 STEP includes SI units, project/site/building/storey, containment, `IfcWall`, `IfcSlab`, `IfcRoof`, `IfcColumn`, `IfcBeam`, `IfcOpeningElement`, void relationships, stable study IDs and custom study properties.
- Extrusions export as `IfcExtrudedAreaSolid`; dome surfaces export as `IfcFacetedBrep`. Do not advertise a certified model-view definition, native RVT/RFA export, BIM authoring round-trip, or Revit compatibility certification.
- IDs are stable for revisions of this local study. Federating multiple independent projects requires a future project namespace; current IDs must not be assumed globally unique across separately created studies.
- Browser-only storage; this feature introduces no server project data or remote writes. RLS remains required before introducing shared project persistence.

## Verification and review gates

| Area | Acceptance criterion / evidence |
| --- | --- |
| Unit | All six presets at smallest, default and largest test configurations produce positive finite profiles; closed dome has paired opposite edges and positive volume; wall openings remain clear; invalid imports are rejected. |
| Integration | Preset changes retain user dimensions; project packages include the study; empty floor-plan handoff produces valid nonoverlapping rooms; populated plans are preserved. |
| IFC | All six default exports parse with IfcOpenShell 0.8.5, pass schema and EXPRESS rules, and tessellate every element. Run the optional independent validation command below for changes to geometry/export. |
| Security | Bounded numeric values, file size, note length, known preset/roof enums and schema; unknown imported fields discarded; STEP text escaped; no HTML injection or image uploads. |
| Accessibility | Labeled controls, native form validation, visible focus, live status, element selector, 44px controls, alternative 2D plan and textual dimensions. Screen-reader usability review remains a release gate. |
| Mobile/web | Browser review at 390px and desktop: no editor/page overflow, dimension updates, template switching and on-demand 3D. Save/reload restores settings. |
| Sources | Precedent images retain the existing catalog's creator, license, source URL, observed date and confidence. Image failures show a source link fallback. |
| Professional | Architect/engineer review of structure, environmental systems, access, fire, qibla/site orientation, cultural context and complete room program remains required. |
| Target application | Actual Revit opening/linking and category/editability review remain **unverified**; independent IFC validation is not a substitute. |

```sh
node --test tests/parametric-building.test.mjs
# In a separate Python environment with ifcopenshell==0.8.5 and pytest installed:
IFC_VALIDATION_PYTHON=/path/to/venv/bin/python node --test tests/parametric-building.test.mjs
```

The independent check is explicitly skipped if its Python environment is not supplied; it is not a runtime dependency. `scripts/validate-building-ifc.py` can also check an existing fixture directory. Test IFC artifacts are written to a temporary directory.

## Sources consulted

Observed 2026-09-21. These are linked technical references, not copied assets; no third-party geometry is embedded.

- [Autodesk IFC Manual: Open IFC](https://autodesk.ifc-manual.com/revit/using-ifc-files-in-revit/open-ifc): official vendor workflow and limitations; confidence `source_backed`; application behavior still needs target-version testing. Rights: vendor documentation, linked only.
- [buildingSMART: IfcExtrudedAreaSolid](https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcExtrudedAreaSolid.htm) and [IfcFacetedBrep](https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcFacetedBrep.htm): geometry concepts; confidence `source_backed`; pages consulted describe IFC4.3. The implemented file schema is IFC4 and is separately checked against IfcOpenShell's IFC4 schema. Rights: buildingSMART documentation, linked only.
- Existing [architecture reference catalog](../apps/web/data/architecture-image-references.json) and [template catalog](../apps/web/lib/mosque-design-templates.ts): image provenance and broader cultural context. A linked photograph does not validate the generated building dimensions or stylistic authenticity.

## Next implementation work

1. Target-version Revit fixtures: verify categories, opening relationships, origin, metre conversion, imported element editability, and retained study IDs. Record versions and failures before claiming compatibility.
2. Replace the single-study ID namespace with project-scoped persistent IDs and test federated exports.
3. Extend the room schema with sill elevation and explicit wall hosts; reconcile user-authored floor-plan partitions with the same solid model instead of adding a second independent building generator.
4. Add door/window assemblies, material layers, dimensioned sections, room boundaries, linked quantities and engineering-reviewed roof junctions.
5. Add measured precedent plans and calibrated multi-view references only with suitable rights, attribution, survey accuracy and professional/cultural review.

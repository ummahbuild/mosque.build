# mosque.build — Design & Construction Implementation v15

This layer deepens the actual building-delivery engine.

## Canonical object rule
Every modeled building element gets a stable ID. The same object can link to:
requirement -> geometry -> quantity -> specification -> cost -> schedule -> product -> submittal -> inspection -> progress -> commissioning -> asset.

## Geometry
Geometry is a deterministic kernel separate from Three.js rendering. Three.js renders domain geometry; it is not the authoritative model.

## Quantity + cost
Takeoffs are versioned by design version and ruleset. Manual overrides require provenance/reason.

## Schedule
Work packages and activities can link to object sets, locations, cost codes, procurement items and inspection hold points.

## Constructability
The app checks access, sequence, maintenance/replacement pathways, temporary works needs and concealed-work dependencies, while clearly retaining professional/contractor review requirements.

## Information management
Use ISO 19650 concepts for organized/versioned delivery information. IFC/BCF/IDS are interoperability targets, not claims that mosque.build replaces professional BIM authoring tools.

## Quality and commissioning
Inspection/Test Plans, hold points, NCRs, functional testing, training and handover are first-class parts of the lifecycle. Commissioning is measured against owner/project requirements and functional scenarios, not simply device power-on.

## Construction progress
Contractor-reported, site-observed, system-calculated and certified-for-payment progress remain distinct.

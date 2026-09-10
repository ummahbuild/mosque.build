# Campus planning module

Status: `executable`

The design workspace now connects the mosque, a pedestrian-priority arrival spine, courtyard, road and drop-off study, parking study, service access, recreation, school, daycare and madrasa in one saved campus record. The record is renderer-neutral; the Three.js view is an adapter over portable box primitives rather than the source of truth.

## What works

- Three starting studies, editable site dimensions, zone positions, dimensions, capacities and visibility.
- Orbit, zoom and click-to-select in the conceptual 3D plan.
- Programme counts for school, daycare and madrasa remain synchronized with their spatial zones.
- Parking demand, drawn parking capacity, accessible-space study allocation and drop-off bay arithmetic use visible user assumptions.
- Walk/wheel/cycle, vehicle and public/shared-transport shares expose incomplete or overallocated mode splits.
- Arrival and departure windows show directional vehicle flow rates; bicycle and coach/community-van spaces stay visible rather than being hidden inside a car-parking total.
- Checks flag boundary overflow, overlaps, vehicle/pedestrian conflicts, play/parking conflicts, daycare/road conflicts, insufficient drawn parking area, narrow walking assumptions, weak courtyard shade and missing service access.
- Browser persistence, project-package inclusion and JSON export with schema, status, assumptions, metrics and review boundaries.

## Review gates

Outputs are not a survey, traffic forecast, parking requirement, safeguarding approval, education licence, accessibility or fire review, planning approval, engineering design, cost plan or instruction to build. Before commitment, obtain current local evidence and qualified planning, transport, accessibility, fire, safeguarding, education, landscape, civil/drainage, environmental, security, architecture, engineering, cost, community and authority review.

## Next build

Replace conceptual rectangles with surveyed GeoJSON boundaries; add time-stepped pedestrian and vehicle paths; record accessible bays, bicycle and public-transport assumptions; connect room schedules to learning buildings; add emergency and service swept-path studies; and export georeferenced context plus IFC-aligned space records. These remain `specified` until implemented and verified.

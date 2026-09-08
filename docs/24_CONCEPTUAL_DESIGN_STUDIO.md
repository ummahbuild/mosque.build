# Conceptual design studio

Status: `executable`

The Design page now provides a locally persistent mosque massing study connected to the project control center. A user can compare compact, courtyard and community-campus forms; vary one to three floors; study a courtyard, dome or minaret form; adjust a provisional qibla angle; rotate the view; and retain the selected scenario across Design and My Project.

The page also includes a deterministic dimensioned-plan study. Users can set a provisional footprint, wall study and qibla bearing; compare compact, courtyard and community room layouts; inspect a room schedule; record whether measurements are estimated, measured-but-unverified or professionally verified; and export portable JSON or SVG. The JSON schema is `mosque.build/schematic-plan@1` and uses metres.

## Truth boundary

The view is a relative planning aid. Its area index is deliberately unitless. It is not surveyed geometry, a capacity calculation, BIM, a structural/MEP/fire model, a permit drawing, a quotation or a construction document. Site boundaries and qibla orientation require verification, and all architecture requires qualified professional development and review.

## Architecture

Canonical scenario data and deterministic helpers live in `apps/web/lib/mosque-massing.ts` and `apps/web/lib/schematic-plan.ts` without renderer objects. The current massing renderer is lightweight CSS perspective; the plan renderer is accessible SVG generated from the portable room model. A later WebGL/glTF renderer or IFC adapter can consume the same scenario and room data without changing the domain objects.

## Persistence

- `mosque-build.design-studio.v1`: view and massing selections.
- `mosque-build.schematic-plan.v1`: provisional dimensions, measurement status and plan selection.
- `mosque-build.control-center.v1`: shared scenario selection used by My Project.

Current persistence is on-device only. Shared projects, authenticated storage, RLS, collaborative review and professional sign-off are not implemented.

# Conceptual design studio

Status: `executable`

The Design page now provides a locally persistent mosque massing study connected to the project control center. A user can compare compact, courtyard and community-campus forms; vary one to three floors; study a courtyard, dome or minaret form; adjust a provisional qibla angle; rotate the view; and retain the selected scenario across Design and My Project.

## Truth boundary

The view is a relative planning aid. Its area index is deliberately unitless. It is not surveyed geometry, a capacity calculation, BIM, a structural/MEP/fire model, a permit drawing, a quotation or a construction document. Site boundaries and qibla orientation require verification, and all architecture requires qualified professional development and review.

## Architecture

Canonical scenario data and deterministic helpers live in `apps/web/lib/mosque-massing.ts` without renderer objects. The current renderer is lightweight CSS perspective so the workflow stays dependency-free and works across supported browsers. A later WebGL or glTF renderer can consume the same scenario IDs without changing the domain object.

## Persistence

- `mosque-build.design-studio.v1`: view and massing selections.
- `mosque-build.control-center.v1`: shared scenario selection used by My Project.

Current persistence is on-device only. Shared projects, authenticated storage, RLS, collaborative review and professional sign-off are not implemented.

# Architecture

This document explains how mosque.build is organized, where truth lives, and how contributors can extend the product without coupling project data to a particular interface or renderer.

## System overview

mosque.build currently ships as a Next.js web application with local-first project workflows. Most public tools save structured records in browser storage and can export JSON. The repository also contains canonical registries, shared domain types, reusable calculations, and Supabase migration drafts for a future authenticated collaboration layer.

```text
User interface
  ↓ validates input and explains review boundaries
Client workflow components
  ↓ read/write versioned browser records
Renderer-neutral domain and calculation modules
  ↓ adapted for presentation
2D views · Three.js views · JSON export · future glTF/IFC exchange
```

External records enter through a separate provenance boundary:

```text
Authority / museum / supplier / publication
  ↓ source URL + observed date + rights + confidence + review state
Runtime reference data
  ↓ conservative user-facing interpretation
Project decision record
  ↓ accountable human or professional review
```

## Architectural principles

### Local first

The current public application stores drafts in the active browser. This reduces accidental collection of project and personal information, supports immediate use without an account, and makes export explicit. Interface copy must not imply cloud synchronization or shared collaboration where none exists.

### Renderer-neutral truth

Domain models describe intent and geometry using portable values: stable IDs, dimensions, coordinates, roles, materials, relationships, evidence, and review state. They must not store `THREE.Mesh`, scene nodes, WebGL resources, or renderer-specific classes.

Three.js components are adapters and inspection views. Destroy geometries, materials, controls, renderers, observers, listeners, and animation frames during cleanup.

### Evidence-aware decisions

Project records distinguish a user-entered observation from a verified external fact, professional decision, authority approval, or completed activity. Calculators expose missing inputs rather than inventing values.

### Versioned contracts

Browser records and exports use stable schema identifiers such as `mosque.build/...@1` or versioned storage keys. Changes must support safe parsing, invalid-data recovery, and an intentional migration path.

### Progressive enhancement

Core navigation and explanatory content must remain useful when WebGL, install prompts, service workers, network access, or browser persistence are unavailable. Interactive features need loading, empty, fallback, and error states.

## Application layers

| Layer | Location | Responsibility |
|---|---|---|
| Routes | `apps/web/app` | Page composition, metadata, route-level styles, manifest, sitemap |
| Components | `apps/web/components` | Accessible UI, forms, workspaces, render adapters |
| Web domain logic | `apps/web/lib` | Calculations, safe parsing, workflow integration, export contracts |
| Runtime reference data | `apps/web/data` | Sources, patterns, jurisdictions, products, assemblies, product areas |
| Shared domain | `packages/domain` | Portable cross-surface types |
| Algorithms | `packages/algorithms` | Reusable and historically versioned calculations |
| Canonical registries | `data` | Feature, frame, dependency, source, and implementation-wave records |
| Persistence drafts | `supabase` | Database schema, RLS, and security migration drafts |
| Validation | `tests`, `scripts` | Behavior, provenance, privacy, route, asset, and release contracts |

## Main product flow

1. `/start` creates or resumes the private project brief.
2. `/my-project` derives a connected view from the records present in the browser.
3. Product workspaces create versioned records for design, approvals, sourcing, construction, and care.
4. Workflow integration reports whether a record is absent, started, or developed and identifies earlier records that may be needed.
5. Project export combines supported records while retaining source and review boundaries.

Presence is not completion. A status shown in the journey reflects record state, not compliance, approval, certification, or professional review.

## 3D and building-model integration

- Store dimensions and semantic intent in domain records.
- Generate Three.js objects at the presentation boundary.
- Attach stable semantic IDs to rendered objects for selection and coordination.
- Keep units explicit and calculations deterministic.
- Use glTF/GLB for render-asset interchange when implemented.
- Use IFC for building-model exchange when implemented and professionally reviewed.
- Treat all current model outputs as conceptual planning aids unless a feature explicitly passes higher review gates.

## Persistence and future backend

Current browser storage is intentionally single-device. A future shared backend must include:

- authenticated organizations, projects, and memberships;
- least-privilege Row Level Security enabled by default;
- automated cross-tenant isolation tests;
- audit history for decisions and regulated records;
- safe import, export, deletion, and account recovery;
- conflict handling and offline synchronization semantics;
- rate limiting, abuse controls, observability, and incident response.

The SQL files under `supabase/migrations` are migration drafts and historical foundations. Their presence does not mean the public app currently stores project data in Supabase.

## Adding a feature

1. Define the user outcome and the honest feature status.
2. Define or extend a renderer-neutral record.
3. State evidence, safety, privacy, accessibility, and professional-review gates.
4. Implement deterministic logic outside the rendering component.
5. Add accessible interaction and explicit fallback states.
6. Connect the record to project export and workflow integration where appropriate.
7. Add unit, integration, accessibility, mobile, security/RLS, and provenance tests as applicable.
8. Update route, feature, and contributor documentation.

## Architecture decisions that require discussion

Open a feature proposal before changing authentication, persistence, schema versioning, storage-key conventions, canonical geometry, interchange formats, licensing boundaries, navigation architecture, or the feature-status model.

# Existing-mosque digital twins and inspiration library — implementation plan

Status: `specified`. No real-world mosque capture, survey, geometry verification, model import or rights clearance is claimed by this document.

## Outcome
Create a searchable, source-labelled library of *existing mosques* with visual and spatial precedents, including optional survey-grade digital twins when rights and evidence allow. Allow each reference to inspire a **new and clearly separate** mosque concept. A photograph or AI approximation must never be labelled an accurate digital twin.

## Acquisition tiers (displayed on every listing)
| Tier | Capture input | Published claim | Not claimed |
|---|---|---|---|
| L0 — inspiration | Attributed public photos, text, location at general city level | Style reference | Measured dimensions, rights to derivatives |
| L1 — schematic | Rights-cleared floor plans, documented dimensions, annotated photography | Approximate reference model with stated error | As-built accuracy |
| L2 — photogrammetry | Consent-based calibrated overlapping images, scale targets, control points | Reconstructed surface with coverage/confidence map | Hidden structure or engineering acceptance |
| L3 — spatial scan | Authorized terrestrial/mobile LiDAR, surveyed controls, registration reports | Point cloud/mesh with defined accuracy and blind spots | Regulatory as-built certification |
| L4 — verified record | Scan + drawings + owner review + qualified survey verification | Versioned verified as-existing model at stated survey date | Future condition or structural design |

## Collect → validate → publish pipeline
1. **Request consent:** Record owner/operator permission, contributor authority, photography restrictions, community/sacred-space sensitivities, publication scope, redistribution and commercial-use permissions; capture consent separately for interior photography and scanning. No publication by default.
2. **Survey plan:** Define coordinate reference, north/qibla datum, local origin, units, dates, intended accuracy, allowed access, restricted rooms, safe capture route, scale targets and equipment calibration.
3. **Capture:** Exterior/interior stills and optional 360 panoramas; measured sketches; drone photogrammetry only when lawful, permitted and safe; terrestrial LiDAR/handheld scan if accessible. Avoid worshippers' faces, license plates, security controls, donations and live security details; redact before upload.
4. **Process locally first:** Inspect EXIF/PII, blur people and signage as needed, remove GPS and other sensitive metadata from public derivatives; deduplicate; calibrate camera poses; register point clouds; record reprojection and alignment residuals; create simplified meshes.
5. **Semantic model:** Associate storeys, prayer halls, mihrab, minbar, qibla datum, courtyards, columns, domes, entrances, wudu, accessible paths, classrooms, material and construction lineage. Separate observed from inferred geometry and attach confidence/coverage.
6. **Open interchange:** Original scans remain private and rights-controlled. Generate optimized GLB/glTF for web viewing; E57 or LAS/LAZ for approved point clouds; IFC4/IFC4.3 only after supported mappings and external validation; 2D SVG/GeoJSON/PDF where appropriate. GLB alone is not BIM.
7. **Quality gates:** Inspect scale, unit, registration errors, georeference tolerance, missing rooms, physical access, scan coverage, texture rights, PII, accessibility disclosure, performance budget and provenance. A qualified professional must sign off any verified-as-existing label.
8. **Review and publish:** Owner rights review + technical review + cultural/community review. Allow community takedown, embargo, image-only public visibility and revocation handling. Remove restricted source artefacts promptly.
9. **Reuse safely:** "Use as inspiration" copies an attributed style/material/massing brief rather than the protected geometry, retaining attribution, source license, and exclusion notes. Explicit reuse rights are required to copy plans/models.

## Proposed import adapters
- **Photos/phone**: guided capture checklist; upload only after permission and privacy scan; image previews with provenance.
- **Matterport/360**: link-based catalog entry first; never scrape or infer redistribution rights; extract no proprietary assets without permission.
- **RealityCapture/Metashape/Polycam/Scaniverse**: user-uploaded permitted exports; validate GLB/OBJ and optional measurement manifest. Brand support is **proposed**, not integrated.
- **OpenStreetMap/Wikidata**: optional public metadata lookups with source timestamps/licensing, not authoritative interior geometry.
- **IFC/Revit**: authorized owner-provided IFC is preferred; ingest/validate supported subset and retain import report. Native RVT import requires an authorized conversion route, not a browser claim.

## Library object — mosque reference
```ts
type MosqueReference = {
  id: string; title: string; country: string; city?: string;
  styleTags: string[]; buildingPeriod?: string; climateTags: string[];
  referenceTier: "L0" | "L1" | "L2" | "L3" | "L4";
  observedAt?: string; submittedAt: string;
  sources: {url?: string; title: string; capturedAt?: string; licence: string; rightsHolder?: string}[];
  consent: {publishApproved: boolean; derivativeApproved: boolean; commercialReuseApproved: boolean; verifiedBy?: string};
  assets: {type: "photo" | "panorama" | "plan" | "glb" | "pointcloud" | "ifc"; uri: string; licence: string; public: boolean; sha256: string}[];
  geometry?: {units: "m"; datum?: string; rmsErrorM?: number; coveragePct?: number; verifiedAt?: string};
  observations: {feature: string; value: string; confidence: "observed" | "inferred" | "unverified"; sourceIndex: number}[];
  moderation: {status: "draft" | "rights_review" | "technical_review" | "approved" | "rejected" | "withdrawn"; notes?: string};
};
```

Do **not** publicly expose raw camera GPS, donor records, security layouts, sensitive internal circulation or unapproved private-room geometry.

## Product work packages / acceptance
**TW-01 — source library**: search by region, capacity *where sourced*, typology, materials, climate, period and data tier; each card links its source, rights and accuracy metadata. Zero synthetic records presented as captured mosques.

**TW-02 — contributor intake**: consent gate, privacy checklist, file restrictions and staged draft uploads. Deny public listing until positive approval; support delete/export and dispute workflow.

**TW-03 — model viewer**: bounded progressive GLB with fallback image, controls, attribution, measured/inferred overlay and performance guard; mobile memory and accessibility tests.

**TW-04 — point cloud and alignment**: point-cloud ingestion and registration diagnostics are feature-gated and do not silently coerce units or coordinate systems.

**TW-05 — inspiration transfer**: source-linked prompt seeds with explicit adaptation and permissions notice; never silently clone building geometry.

**TW-06 — IFC/Revit adapter**: IFC validation fixtures, object/properties mapping and round-trip comparison with licensed source data; documented failed mappings.

**TW-07 — provenance/rights**: automated rejection for missing rights or approval, moderation audit and revocation/takedown tests.

**TW-08 — cost/capture guidance**: public checklists for volunteer phone capture, professional photogrammetry and survey-grade scanning, with costs only when dated/location-sourced.

## Prompt-first interface contract
The front page accepts an unrestricted plain-language mosque brief, shows rotating illustrative examples only while empty, and allows editing selected presets. Saved text is local and is **not AI-generated or automatically converted to BIM**. Next stages are structured parser → editable project brief → parametric layout options → geometry validity & reviewer gates → visually compared 3D concepts → quantity and local cost scenarios with verified inputs. Track source status and avoid speculative cost or compliance claims.

### Example seed variety
Kilimani Moroccan mosque under $1M; Indian-modern school mosque; prayer room inside a mall; Swahili coastal mosque; compact rural low-cost masjid; inclusive women-led community hub; Ottoman-style phased campus; warehouse conversion; Sahelian earth mosque; solar-resilient neighborhood mosque; airport musalla; modular prefabricated expansion.

## Security and performance checks
- No user text transmitted without clear affirmative action; localStorage guarded for private mode and quota errors.
- Restrict upload file size/types, parse geometries in sandboxed worker where possible, strip scripts/external references, cap vertices/textures and reject decompression bombs.
- Pin attribution/license per asset; prevent cross-tenant access once shared storage exists and validate RLS.
- Require explicit consent for geolocation and public mapped pins; display approximate location by default.
- Include reduced-motion fallback, accessible list alternative to interactive 3D and keyboard camera controls.

## Delivery order
1. Prompt-first landing and editable examples (initial executable UI slice).
2. Prompt-to-project-brief mapping with validation, preserving user's exact text.
3. Curated verified historical architecture entries (L0) with links and rights; do not fabricate building data.
4. Consent-gated submission workflow and moderation schema.
5. GLB viewer with fallback and performance budgets.
6. Photo/plan authoring evidence and L1/L2 import with accuracy indicators.
7. IFC4 validation and eventually Revit-compatible exchange.

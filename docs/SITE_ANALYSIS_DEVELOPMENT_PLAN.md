# Site analysis development plan

## Product outcome

Help a mosque project team compare land and adaptive-reuse options without mistaking a dashboard for due diligence. The canonical record remains renderer-neutral, source-aware and portable. The interface must keep user observations, official source material, consultant findings, community priorities and authority decisions visibly distinct.

## Current capability

Status: `executable` locally.

The design workspace now supports up to eight anonymous candidates across twenty review criteria. Each finding records evidence maturity, an interpreted constraint/opportunity signal, source reference, observation date, reviewer role and limitations. Comparison exposes coverage and unknowns but never ranks or recommends a site. Records persist on device and travel in the allowlisted project package.

The next execution layer is also `executable` locally: sixteen investigation workstreams, five commitment hold points and bounded review snapshots turn unknowns into accountable scopes, evidence references, target dates and next actions. These remain user-entered workflow records rather than verified appointments, completed due diligence or releases to proceed.

## P0 — evidence integrity and privacy

1. Replace free-text source references with versioned evidence objects: source type, issuer, title, URL/file reference, observed date, effective date, expiry/staleness, rights, confidence and review status.
2. Add encrypted authenticated projects with organization membership and mandatory RLS policies/tests before storing addresses, parcel identifiers, ownership records or uploaded reports.
3. Add share-safe redaction for all future geometry and location fields, with export preview and explicit consent.
4. Add immutable evidence revisions and supersession links; never silently overwrite a consultant or authority record.
5. Add malware scanning, MIME verification, file-size limits and retention policy before attachments.

Acceptance: unit, integration, RLS/security, accessibility and source-provenance tests; threat model; privacy review; no public or anonymous access to project records.

## P1 — map and survey interchange

1. Add an optional GeoJSON site boundary importer with coordinate-reference metadata, precision warning and geometry validation.
2. Keep map geometry separate from legal title boundaries and label the source/status of each line.
3. Add survey control, benchmarks, contours, spot levels, easements and measured existing features as portable domain objects.
4. Add deterministic area/perimeter calculations with units, tolerance and test fixtures.
5. Add site-envelope overlays only from user-entered or source-backed setbacks; never infer requirements from country alone.
6. Add terrain visualization through a renderer adapter; canonical records must not contain Three.js objects.
7. Add IFC georeferencing/export mapping after interoperability fixtures and round-trip tests exist.

Acceptance: invalid/self-intersecting geometry rejected; CRS preserved; precision disclosed; desktop/mobile parity; export round-trip tests; licensed basemap review.

## P1 — official context connectors

1. Create jurisdiction adapters for planning designations, official hazard layers, heritage registers, transport and utility providers.
2. Every fetched record must include provenance, observed date, license/rights, confidence, geographic coverage and staleness.
3. Treat service availability and development permission as unknown until verified by the responsible provider or authority.
4. Add source-change monitoring with human review before records affect project conclusions.
5. Add a jurisdiction-specific investigation checklist without fabricating universal requirements.

Acceptance: source contract tests, stale/error/empty states, rate-limit handling, cached provenance, human approval gate and “likely applicable / verify with authority or professional” language.

## P1 — analysis engines

1. Solar and overshadowing study using dated weather/location inputs and a transparent calculation basis.
2. Terrain, accessible-gradient and earthworks prompts using surveyed levels; outputs remain conceptual until professional review.
3. Surface-water flow-path exploration using declared terrain/rainfall inputs; never present it as flood certification.
4. Qibla-to-envelope and prayer-row option comparison with source/accuracy propagation.
5. Multi-modal arrival scenarios for daily, Friday, Ramadan, Eid, school, funeral and concurrent events.
6. Utility demand-versus-confirmed-capacity register with provider evidence and engineering review.
7. Adaptive-reuse audit connecting measured structure, fire strategy, accessibility, envelope, MEP, hazardous materials and heritage constraints.
8. Scenario comparison showing assumptions and sensitivity—not a composite “site score.”

Acceptance: deterministic fixtures, unit-aware calculations, uncertainty ranges, accessibility review, professional validation datasets and no automated approval/recommendation claim.

## P2 — field investigation

1. Offline survey packs with role, scope, device label and explicit sync conflicts.
2. Photo/observation capture linked to criterion, date, orientation and non-personal author role.
3. Investigation request register for survey, geotechnical, drainage, ecology, traffic, utilities, heritage, contamination and measured-building work.
4. Sampling-location records and chain-of-custody references without storing regulated results as unreviewed facts.
5. Site-visit accessibility mode with large targets, offline drafts and clear unsynced state.

Acceptance: offline conflict tests, attachment security, consent/privacy UX, accessibility field testing and accountable review before merge.

## P2 — decisions and governance

1. Separate community priorities, technical constraints, authority requirements and commercial negotiations.
2. Add option assumptions, decisions, dissent, owner role, target date and evidence links.
3. Add hold points before offer, lease, purchase, design freeze and construction commitment.
4. Add professional sign-off requests without representing user-selected states as verified credentials.
5. Add auditable comparison snapshots so later evidence cannot rewrite the basis of an earlier decision.

Acceptance: immutable approved snapshot, role permissions, decision-history tests, explicit withdrawal/supersession and exportable review pack.

## P3 — collaboration and production readiness

1. Authenticated multi-user comments, assignments and notifications with RLS.
2. Conflict-safe synchronization and optimistic updates.
3. Organization-configurable review gates and retention.
4. Observability for connector failures, stale sources, sync conflicts and export errors without collecting unnecessary location data.
5. Performance budgets for large boundaries, terrain and evidence registers.
6. Independent security, accessibility, privacy and regulated-work review before `production_ready` status.

## Definition of ready for every issue

Each issue must declare user outcome, feature status, source burden, privacy/security impact, regulated-review gate, data model, failure/empty/loading states, mobile/web parity, accessibility tests, unit/integration tests, RLS tests where applicable, migration/rollback, telemetry limits and documentation changes.

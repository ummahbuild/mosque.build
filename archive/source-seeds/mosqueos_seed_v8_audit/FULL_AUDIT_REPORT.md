# mosque.build — Full Audit & Completeness Correction (v8)

Generated: 2026-08-16

## Audit scope
Audited modules: mosqueos_seed_v0, mosqueos_seed_v1_scale, mosqueos_seed_v2_product, mosqueos_seed_v3_pitch_team_pwa, mosqueos_seed_v4_adaptive_reuse, mosqueos_seed_v5_procurement_build_control, mosqueos_seed_v6_costs_scenarios, mosqueos_seed_v7_completeness
JSON files parsed successfully: 110
Parse errors: 0

## Overall verdict
The product vision is now unusually comprehensive, but the repository should **not yet be described as production-ready or data-complete**.

The largest strengths are:
- end-to-end lifecycle coverage from community need through operations/preservation,
- mosque-specific 2D/3D, qibla, saff, wudu, madrasa, Ramadan and waqf thinking,
- strong provenance/rights philosophy,
- good separation of new build vs adaptive reuse,
- increasingly mature construction controls and commissioning concepts.

The largest remaining gaps are:
1. no single canonical schema/authority layer across v0-v7,
2. factual ingestion remains far below the target counts,
3. cost catalogs are mostly structured placeholders rather than verified local rates,
4. global regulatory packs are shells,
5. no executable Supabase migrations/RLS/API implementation yet,
6. incomplete exact UI copy/i18n,
7. incomplete geometric kernel/offline-sync/religious-calculation contracts,
8. incomplete accounting, subscription/entitlement, support and SRE layers.

## Critical corrections

### AUD-001 — No single canonical authority layer across v0-v7
**Finding:** Components, materials, features, screens, sources, and backlog items are split across version folders. A code harness can reasonably import multiple competing definitions without knowing which record is authoritative.

**Correction:** Create stable canonical entity namespaces, a supersedes map, and a single root registry. New modules extend canonical IDs instead of creating parallel taxonomies.

### AUD-002 — Scale targets are mostly ingestion capacity, not completed factual datasets
**Finding:** The 5,000 mosque, 10,000 supplier/product, 1,600 drawing, 550 video and country-regulatory targets are structured queues/shells, not verified records.

**Correction:** Separate target_count, candidate_count, verified_count, reviewed_count and publishable_count. UI/docs must never call target slots 'ingested'.

### AUD-003 — Material cost catalog is structurally rich but largely unpriced
**Finding:** Most 170 cost records explicitly have null local/import quotes. The platform cannot yet make production-grade regional cost claims.

**Correction:** Add cost-data coverage metrics, quote ingestion pipeline, regional price books, freshness SLAs, and fallback hierarchy. Only deterministic placeholders can be used before verified quotes.

### AUD-004 — Regulatory packs are global shells, not verified jurisdiction packs
**Finding:** 249 geographic shells were created, but launch-grade planning/building/fire/accessibility/tax/waqf rules require official-source research by country and subnational jurisdiction.

**Correction:** Require launch-jurisdiction completeness score and qualified review. Default all other packs to research_required.

## High-priority corrections

### AUD-005 — No executable Supabase schema/migrations or RLS policies
A table inventory exists but not SQL migrations, indexes, foreign keys, triggers, storage policies, RPC functions, or RLS test fixtures.

**Fix:** Generate migration plan, canonical table contracts, RLS role matrix and SQL test requirements before implementation can be called production-ready.

### AUD-006 — Offline behavior is mentioned but conflict resolution is underspecified
Field reports, scans, inspections, photos, tasks and edits can be created offline, but there is no canonical outbox, idempotency, conflict or attachment retry protocol.

**Fix:** Define local mutation envelope, client UUIDs, version numbers, last-write rules only for safe entities, conflict queue for high-value records, and deterministic attachment retry.

### AUD-007 — Three.js vision lacks a canonical geometric kernel contract
Features exist for massing, floors, rooms, qibla and saff, but units, coordinate systems, snapping, topology, undo/redo, constraints, geometry versioning and validation rules are not defined.

**Fix:** Add geometric kernel requirements and deterministic pure-function architecture separate from rendering.

### AUD-008 — Religious-review requirement exists but prayer/qibla methodology is incomplete
The product distinguishes religious claims from architecture, but it does not yet define qibla geodesic calculation, prayer-time methods, Asr method, high-latitude handling, or mosque-published iqama provenance.

**Fix:** Add a religious-calculation policy registry and treat calculated prayer times separately from congregation schedules.

### AUD-009 — Property discovery/listing ingestion lacks licensing and transaction workflow depth
Paste listing/search concepts exist, but there is no canonical real-estate provider policy, listing freshness model, broker/contact workflow, offer/LOI state machine, financing contingency, closing checklist or appraisal workflow.

**Fix:** Add property acquisition lifecycle and provider-rights abstraction.

### AUD-010 — Progress monitoring lacks a canonical schedule/cost baseline relationship
Progress, schedule of values, activities and payment claims are modeled, but baseline revision rules and linkage among WBS/activity/cost code/model object are not canonical.

**Fix:** Introduce Control Account / Work Package links and immutable baseline revisions.

### AUD-011 — No full operating calendar / recurring workload engine
Maintenance, Ramadan and programs exist, but no unified recurrence/calendar engine covers daily opening, salah preparation, cleaning, inspections, classes, payroll, permits, warranties, Ramadan and annual governance.

**Fix:** Add recurrence engine with iCal-compatible rules, owners, escalation and completion evidence.

### AUD-012 — Accounting integration and fund accounting are not yet complete
Restricted funds and donations are modeled, but chart of accounts, journal mapping, bank reconciliation, fiscal year, accrual/cash accounting modes, vendor bills and financial statements are missing.

**Fix:** Add accounting ledger boundary and integrations; mosque.build need not replace accounting software but must map transactions correctly.

### AUD-013 — Security controls exist but no formal threat model, incident response or RPO/RTO
MFA/RLS/backups are referenced without explicit SLOs, recovery objectives, breach/incident workflow or threat inventory.

**Fix:** Add threat model, security incident plan, RPO/RTO targets by data class, key rotation and disaster-recovery test cadence.

### AUD-014 — Exact UI copy is incomplete across the full route/state inventory
Screen contracts exist, but most states contain structural slots rather than production copy.

**Fix:** Create copy registry keyed by route/state/action/error with translation/review status.

## Canonical completeness rule

From v8 onward, every dataset must report:
- target count
- candidate count
- verified count
- reviewed count
- publishable count
- stale count
- rejected count

A research queue is not an ingested dataset.

Every public factual record must meet its record-type publication gate.

## Production milestone recommendation

### Gate A — Canonical foundation
- canonical IDs and supersession mapping
- executable database schema/migrations
- RLS and permissions tests
- event contracts
- offline-sync contract
- geometry kernel
- qibla/prayer calculation module
- source/rights registry
- copy/i18n registry

### Gate B — Launch data
Pick one launch geography and complete:
- verified mosque directory
- official planning/building/fire/accessibility sources
- regional cost observations
- suppliers/products
- adaptive-reuse cases
- prayer/Jumuah profile freshness
- legal/charity/waqf information

### Gate C — Design/build alpha
- site and qibla
- saved scenarios
- 2D/3D deterministic geometry
- program/capacity
- cost and lifecycle estimates
- adaptive-reuse scanner
- permit checklist
- procurement/construction tracking

### Gate D — Operations
- asset register
- maintenance
- cleaning
- staff/volunteers
- programs/madrasa
- Ramadan/iftar
- donations/fund restrictions
- annual reports

### Gate E — Production
- security review
- backup/restore rehearsal
- accessibility
- performance/load tests
- legal/religious/architectural review
- provider terms/licensing review
- app-store/web release gates

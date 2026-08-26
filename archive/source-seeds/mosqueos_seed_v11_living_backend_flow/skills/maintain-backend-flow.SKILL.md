# Skill: Maintain mosque.build Living Backend Flow

## Purpose
Keep the backend architecture overview synchronized with implementation changes.

## Trigger
Run this skill whenever any of these change:
- database schema or migrations
- API endpoints
- RLS/permissions
- background jobs
- external integrations
- event names
- design/cost/fundraising/procurement/construction workflows
- public data ingestion
- accounting/reconciliation logic
- vendor marketplace logic
- design publishing/re-upload behavior
- construction progress or transparency behavior

## Required steps
1. Read `schemas/BACKEND_PROCESS_REGISTRY.json`.
2. Identify which backend processes are affected.
3. Update existing process records rather than creating duplicates.
4. If a new process is introduced, assign a stable domain-prefixed ID.
5. Update `schemas/BACKEND_FLOW_EDGES.json`.
6. Every process MUST document:
   - trigger
   - inputs
   - auth/RLS
   - validation
   - database writes
   - events
   - downstream jobs/integrations
   - failures/retry behavior
   - audit trail
   - user-visible state
7. Run:
   `python scripts/validate_backend_flow.py`
8. Run:
   `python scripts/generate_backend_flow.py`
9. Review both:
   - `flows/EXECUTIVE_BACKEND_FLOW.mmd`
   - `flows/TECHNICAL_BACKEND_PROCESS_FLOW.mmd`
10. If any public/legal/financial claim changed, verify the relevant source/review state too.

## Rules
- Never hand-edit generated Mermaid files as the source of truth.
- Never remove a historical process ID and reuse it for another purpose.
- High-value financial and legal processes must remain auditable.
- External crowdfunding/provider data must retain provider IDs and sync timestamps.
- Vendor reference projects may be `self-reported`, `verified`, or `disputed`; never imply client endorsement without evidence.
- Public reusable mosque designs must record license/rights/credit and whether copying/forking is allowed.
- Public financial transparency snapshots must be derived from reconciled/approved data, not ad hoc manual totals.

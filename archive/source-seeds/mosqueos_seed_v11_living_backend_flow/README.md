# mosque.build — Living Backend Architecture v11

This package makes the backend architecture self-updating from structured process definitions.

## Source of truth
- `schemas/BACKEND_PROCESS_REGISTRY.json`
- `schemas/BACKEND_FLOW_EDGES.json`

## Generated outputs
- `flows/EXECUTIVE_BACKEND_FLOW.mmd`
- `flows/TECHNICAL_BACKEND_PROCESS_FLOW.mmd`
- `docs/BACKEND_PROCESS_CATALOG.md`

## Auto-update workflow
Run:
```bash
python scripts/validate_backend_flow.py
python scripts/generate_backend_flow.py
```

CI should regenerate these files and fail when committed diagrams are stale.

## Newly explicit product systems
- aggregate fundraising across direct and external channels
- nonprofit/fiscal-sponsor verification and receipt gating
- public financial/construction transparency snapshots
- publish/fork reusable mosque designs and mockups
- re-upload external architect files with diff/reconciliation
- vendor storefronts and supplier catalogs
- verified vendor references tied to real mosque projects

# Feature Prioritization

Every normalized feature receives separate scores. A large feature is not automatically low priority; foundational features can score high despite complexity.

## Complexity dimensions

| Field | Scale | Meaning |
|---|---:|---|
| `development_complexity` | 1–5 | Implementation effort / architecture difficulty |
| `interaction_complexity` | 0–5 | Statefulness, editor behavior, collaboration |
| `external_dependency_cost` | 0–5 | Paid APIs/services, usage-based cost, vendor reliance |
| `ai_dependency` | 0–3 | None → optional assist → core AI workflow |
| `marketplace_complexity` | 0–3 | Directory → RFQ → transaction/fulfillment |
| `local_data_complexity` | 0–3 | Static/local → jurisdiction/region-specific dynamic data |
| `regulatory_risk` | 0–3 | None → regulated / authority-sensitive |
| `safety_criticality` | 0–3 | Informational → professional/safety gate |
| `data_provenance_burden` | 0–3 | Internal → external facts requiring continual verification |
| `cross_platform_complexity` | 0–3 | One surface → web/native parity |

## Priority dimensions
- `user_value` 1–5
- `foundation_value` 1–5
- `dependency_centrality` 1–5
- `differentiation` 1–5
- `revenue_or_sustainability_value` 1–5
- `risk_reduction_value` 1–5

## Priority score
The generated registry uses a deterministic heuristic:

`priority = 3*foundation + 3*user_value + 2*dependency_centrality + 2*risk_reduction + differentiation + revenue_value - development_complexity - external_dependency_cost - regulatory_risk`

This score is for sequencing, not product truth. Product leadership can override it with documented rationale.

## Development waves

**Wave 0 — Trust foundation**
Auth, organizations/projects, RLS, sources/provenance, audit logs, project shell, stable IDs, universal app states, design system.

**Wave 1 — Guided mosque project**
Onboarding, community brief, project dashboard, basic site record, jurisdiction selector shell, budget shell, public project page.

**Wave 2 — Core mosque design**
Room/wall/opening solver, qibla, prayer rows/capacity, 2D editor, simple 3D scene graph, scan/import, adaptive reuse, quick-replace binding.

**Wave 3 — Cost / sourcing / permits**
Takeoff, assembly explosion, cost observations, marketplace directory, local sourcing, permit checklist/data provenance, RFQ compare.

**Wave 4 — Fund / build**
Campaign/component sponsorship, restricted funds model, construction timeline, daily reports, RFI/submittals, inspections, progress evidence.

**Wave 5 — Commission / operate**
Commissioning, handover asset register, maintenance, work orders, operations, Ramadan/event modes.

**Wave 6 — Intelligence / network effects**
Regional packs, verified cost benchmarks, demographic intelligence, library/book recommendations, vendor performance, post-occupancy learning.

**Wave 7 — Advanced**
Native 3D, large BIM, AR, optimization copilot, multi-project procurement aggregation, richer simulations.

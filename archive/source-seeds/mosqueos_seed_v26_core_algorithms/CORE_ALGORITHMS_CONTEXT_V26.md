# mosque.build — Core Algorithms & Execution v26

This pass implements several previously missing core algorithms and strengthens the executable path.

## Added
- closed-cycle room extraction foundation
- polygon geometry helpers
- obstacle-aware saff layout v2
- door-swing polygon generator
- executable takeoff + assembly explosion + cost rollup
- estimate maturity scoring
- RLS policy/test scaffolding
- synthetic end-to-end demo runner
- 48 additional implementation-driven features

## Important limitations
The current cycle extractor is a tested graph/DFS foundation, not yet a production planar-face engine. Complex intersecting wall graphs, holes, nested faces and robust boolean clipping still require a half-edge/planar geometry implementation or mature geometry library.

## Data truth
Rates in demo code are synthetic. No regional cost is treated as factual unless it has a dated sourced observation.

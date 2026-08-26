# mosque.build — Production Definition of Done

A feature is not done because the UI renders. It is done when product behavior, data provenance, permissions, tests, accessibility, observability, SEO/indexing behavior, admin workflows, and failure states are complete.

## Required for every feature
- purpose + user story
- inputs/outputs
- mobile + desktop states
- loading/empty/error/stale/provider-unavailable states
- auth/RBAC if private
- source/provenance if externally sourced
- analytics
- tests
- logs/metrics where operational
- accessibility
- SEO/index/noindex decision
- documentation
- review status

## Production hard gates
- payments reconcile
- mosque claim abuse flows tested
- map/provider licensing reviewed
- launch jurisdiction reviewed
- backups restored in rehearsal
- no fabricated permit approvals
- no AI-generated construction video represented as real evidence
- no unauthorized plan/photo/catalog redistribution

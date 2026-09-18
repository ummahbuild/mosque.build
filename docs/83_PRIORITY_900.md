# Priority feature issues 801–900

Status: `specified` as a deterministic review and issue-selection surface. Individual records retain their canonical maturity.

The `/features/priority-900` route exposes the ninth non-overlapping set of 100 records from the canonical feature registry. Ordering uses the same deterministic priority score and title tie-break as batches 1–8.

Each card retains its feature ID, description, product domains, maturity status, recommended delivery wave, priority score, development complexity, provenance burden, source count, external-service signal, AI signal, and professional or authority gate. Users can search, filter, shortlist locally, and export selected records for issue planning.

## Acceptance criteria

- Exactly 100 records are returned for batch 9.
- IDs do not overlap batches 1–8.
- Registry maturity is not rewritten when an issue appears in the batch.
- Search, filters, URL state, shortlist persistence, and export use the shared explorer.
- External facts still require source provenance and freshness checks.
- Regulated, safety-critical, cultural, and religious work retains its human review gate.
- Delivery requires unit, integration, accessibility, mobile, provenance, and security tests where applicable.
- Inclusion never claims that the feature is shipped, approved, compliant, or production-ready.

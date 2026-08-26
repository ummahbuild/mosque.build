# Test Strategy

## Pyramid
1. **Pure unit tests** — geometry, qibla math, takeoff, cost rollups, scoring, state machines.
2. **Contract tests** — APIs, event catalog, registry schemas, renderer adapters.
3. **Database/RLS tests** — role matrices, tenant isolation, public/private read models.
4. **Integration tests** — design → quantity → cost → procurement → construction → asset.
5. **E2E web tests** — onboarding, project, design, permit, funding, procurement, construction.
6. **Mobile tests** — scan capture state, offline outbox, field reports, donor flows.
7. **Accessibility** — keyboard, focus, labels, contrast, reduced motion, screen reader.
8. **Visual regression** — key mockup-derived routes at desktop/tablet/mobile breakpoints.
9. **Data/source tests** — provenance, freshness, rights, confidence, queue-vs-fact validation.
10. **Professional/religious review gates** — safety, authority, and religious content cannot be "unit tested" into approval.

## Critical invariants
- A queue target can never appear as a verified record.
- A cost without `observed_at`, geography, currency and source cannot be displayed as current factual pricing.
- A permit rule without authority/provenance cannot be labeled mandatory.
- A contractor-reported progress value cannot automatically become certified payment progress.
- Rendering objects never become canonical domain source of truth.
- Donations restricted to a purpose cannot be silently reallocated.
- Sacred text cannot be inserted as decorative generated content without reviewed exact text metadata.

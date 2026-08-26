# Priority Feature Batch 701–800

Status: `executable` explorer over canonical records; individual feature statuses remain unchanged.

The `/features/priority-800` route exposes the eighth deterministic, non-overlapping group of 100 canonical records. The existing narrow PWA/landing selector contains 756 records. Records after 756 therefore continue with the remaining canonical roadmap, ranked by priority score and title. The UI states this boundary explicitly.

## Working functionality

- 100 records numbered 701–800.
- Search, domain/wave/status/dependency filters, gate and shortlist views.
- Shareable URL state and device-local shortlist persistence.
- JSON and CSV exports with canonical status and review context.
- Delivery/evidence details, accessible empty/loading/live states and compact view.
- Previous-batch navigation, sitemap entry and offline PWA shell caching.

## Verification declaration

- Unit: deterministic 800-record uniqueness test.
- Integration: repository validator requires the route.
- Accessibility: labelled controls, live result state and 44px actions.
- Mobile/web parity: responsive explorer cards and horizontally safe controls.
- Provenance: exports retain source-reference count and provenance burden.
- Review gates: external, AI and professional/authority flags remain visible.

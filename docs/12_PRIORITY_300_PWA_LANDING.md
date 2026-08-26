# Priority 300 PWA + Landing Batch

The third delivery pass adds `/features/priority-300`, covering distinct canonical records 201–300 in the deterministic ordering shared by all three batches.

## Shipped product behavior

- 100 registry-backed records, continuing cumulative numbering from 201.
- Search plus domain, wave, canonical-status and dependency filters.
- URL-persisted filters for review links.
- Comfortable and compact display modes.
- A browser-local shortlist shared across all batches.
- A batch summary for shortlisted professional gates and external-service candidates.
- JSON shortlist export with canonical IDs, status, wave, priority, source count, complexity, provenance burden and review flags.
- PWA shell inclusion and offline navigation support.

## Truth boundary

This page is an executable backlog-review surface. It does not change the canonical status of any listed feature. Export files are planning artifacts, not delivery evidence. External-service details require current provider verification; AI records require human validation; and professional or authority gates remain mandatory where flagged.

## Verification contract

- Unit/registry: at least 300 unique matching canonical records.
- Integration/build: the static route, sitemap and PWA shell compile successfully.
- Accessibility: labelled controls, keyboard-operable native inputs, live result/export status, visible focus treatment and 44px control targets.
- Mobile/web parity: filters, cards, shortlist summary and empty state work without horizontal overflow.
- Source/provenance: record details and exports preserve source counts and provenance-burden metadata.
- Human/professional review: required before any gated candidate advances beyond its registry status.

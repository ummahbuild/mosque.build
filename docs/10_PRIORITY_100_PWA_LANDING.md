# Priority 100 PWA + Landing Batch

`/features/priority-100` turns a deterministic, priority-sorted subset of the canonical feature registry into a usable public product surface.

## Selection

- Match PWA, landing, onboarding, offline, accessibility, navigation, search, project, community, mobile, workspace, progress, export, language and responsive terms across title, description and domains.
- Sort by `priority_score` descending, then title.
- Take exactly 100 records.
- Preserve canonical status, recommended wave, source count, external-service likelihood, AI dependency and professional/authority review-gate metadata.

Inclusion in the batch does not change a record’s delivery status.

## Executable surface

- free-text search
- domain filter
- implementation-wave filter
- professional/authority-gate filter
- private local shortlist and shortlist-only view
- immediate local persistence for PWA restarts
- expandable evidence and dependency details
- live result counts
- empty and clear-filter states
- responsive 320px-to-desktop layout
- static generation, sitemap inclusion and service-worker shell caching

## Safety boundary

The batch is a planning and discovery surface. `specified` does not mean shipped. External facts require provenance and freshness. Permit records remain likely applicable until verified with the relevant authority or professional. Safety-critical and religious workflows retain their documented review gates.

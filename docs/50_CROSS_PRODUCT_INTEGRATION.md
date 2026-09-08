# Cross-product integration release

Status: `executable` locally.

## What changed

- Added one canonical map for 18 workflows across six project stages.
- Connected every mapped workflow to its existing allowlisted local-storage contract and working route.
- Added explicit upstream dependencies instead of silently letting downstream tools imply readiness.
- Added `no-record`, `started`, and `developed` record-presence states without mislabeling work as complete.
- Added community, professional, authority, and project-team review gates to every workflow card.
- Added record-count summaries across heterogeneous module shapes.
- Added record freshness checks using dates already stored by each feature.
- Added a 90-day freshness-review signal; it is a prompt, not an assertion that evidence has expired.
- Added available-next-move suggestions derived only from present upstream records.
- Added human-readable dependency blockers such as “Connect first: Schematic plan”.
- Added stage filtering and a focused needs-attention view.
- Added direct continuation links into Design, Permits, Funding, Marketplace, Construction, and Operations.
- Added live refresh after any `mosque-build:project-change` event or cross-tab storage update.
- Added a typed floor-plan change event so future plan consumers can react without coupling to its UI.
- Added responsive layouts for phone, tablet, and desktop project maps.
- Added keyboard-accessible native links, buttons, and filters.
- Added deterministic unit tests for lifecycle coverage, unique storage contracts, dependency gaps, freshness, next moves, and safety copy.

## Important boundary

The map reports local record presence, not evidence quality, professional completion, authority approval, regulatory compliance, or team agreement. It does not merge feature statuses into a single “done” flag.

## Next integration slices

1. Replace single-use marketplace handoffs with a versioned, bounded handoff inbox.
2. Let the detailed floor plan become an optional geometry source for the room program and Three.js renderer.
3. Link material records to stable room and opening IDs rather than free-text zones.
4. Link procurement comparisons back to material decision IDs and construction work packages.
5. Link accepted installed materials to handover assets and maintenance plans.
6. Introduce authenticated projects only with organization roles, RLS, migration preview, conflict handling, and audit tests.

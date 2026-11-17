# Visible 3D preview lifecycle — 2026-11-17

Status: **executable**. This release addresses offscreen render scheduling in five existing viewers; it does not certify whole-app performance or architectural outputs.

## Problem and behavior

The schematic, site coordination, interior, interior systems and ornamental previews previously scheduled animation frames continuously while mounted. Four also rendered while the document was hidden. On the long design page, several WebGL renderers could therefore work on models outside the viewport.

Each viewer now uses `apps/web/lib/visible-render-loop.ts`. A preview waits for its first intersection, renders while intersecting and the document is visible, cancels pending work when it leaves the viewport or the tab is hidden, and resumes with its existing scene and camera. Cleanup removes the observer, visibility listener and scheduled frame before disposing renderer resources. A generation guard prevents stale callbacks from reviving a stopped loop or clearing a newer frame. Browsers without IntersectionObserver retain rendering and document-visibility pausing.

The existing geometry, exports, interaction handlers, reduced-motion choices and persisted project data are unchanged. This is scheduling, not viewport-triggered scene destruction. It does not defer WebGL context creation or geometry generation, and other viewers with different animation lifecycles remain outside this change.

## Acceptance criteria

- [x] No scheduled render work before the first intersection or while offscreen/hidden.
- [x] Resume one loop on return without resetting the caller's state.
- [x] Repeated visibility events cannot create duplicate loops.
- [x] Rapid hide/show transitions reject old callbacks.
- [x] Cleanup is idempotent, including cleanup during drawing.
- [x] Real browser intersection events stop and resume the shared utility.
- [x] All five integrations stop scheduling before resource disposal.

## Validation and review gates

- Unit: 14 behavioral tests of scheduling, browser adapter, fallback, lifecycle races and failures.
- Integration: five component wiring/cleanup contracts; complete suite **972 passed, one pre-existing optional IFC skip** (973 total).
- Browser utility check: a temporary local harness using the actual compiled utility showed frame count **1076 → 1076** while offscreen, then **1105** after returning. Disposing at **1695** held the count at **1695** after scrolling away/back. No console warnings/errors in that harness. It was not added to the public app.
- Production build / TypeScript: passed; all 101 static pages generated.
- Accessibility / mobile-web parity: automated existing accessibility contracts pass. The utility harness rendered and accepted scroll controls at 390 × 844. Actual design-page navigation timed out in the browser automation, followed by a reconnect timeout; full-page visual/keyboard/mobile regression checks are unverified for this release. Scheduler does not move focus, scroll the page, alter keyboard handlers, or override reduced-motion settings.
- Repository validation: passed (63 frames, 6315 normalized features, 20 public routes).
- Privacy scan: passed (1391 files before this report); no data collection or external transmission introduced.
- RLS/security: no database, permission, network or shared-data change; existing security suite passes.
- Source/provenance: no new external factual records or assets.
- Human/professional review: no engineering, religious or regulatory outputs changed; their existing review requirements remain.

Broader device/performance work in issues #30, #26 and #22 remains open. No battery-life or frame-rate improvement is claimed without hardware measurements.

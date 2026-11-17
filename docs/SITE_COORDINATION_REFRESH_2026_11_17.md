# Site coordination refresh and saved-input recovery — 2026-11-17

Status: **executable**. Scope is the site coordination preview, its local-data adapter and render-state handling. Conceptual geometry remains subject to the existing professional review boundaries.

## Verified defects and fixes

- Rebuilding the scene after a project-change event used default object visibility, even when the layer checkbox remained unchecked. The viewer now reapplies its current layer visibility to every replacement group.
- A hidden selected object remained in the inspector. Hiding its layer now clears selection and highlight; hiding another layer keeps the selection.
- `Number(value) || fallback` discarded a valid north/0° bearing. Source precedence now distinguishes zero from missing, empty, non-finite or out-of-range values.
- Bearing, reference, confidence and tolerance could come from different saved sources. The chosen bearing now carries only its own source metadata; a reference from an older bearing cannot make it appear referenced.
- Malformed saved roots, null array entries, object-shaped access lists and invalid terrain elevations could throw or create non-finite geometry. A read-only input adapter bounds preview arrays, omits invalid rows, checks numbers and preserves saved bytes. The UI reports damaged or oversized inputs without overwriting them.
- Another tab's relevant storage edits or storage clear did not refresh the scene. The new subscription handles those events, ignores unrelated keys/session storage and disconnects on unmount.
- Controls appeared active before renderer setup. View and image controls/layer toggles now wait for readiness, while the status explains loading or failure. View buttons expose their active state; canvas keyboard focus is visible.
- Narrow inspector columns split ordinary words at 1024 px. Details now stack labels above values so names and source references use the available width.
- Cleanup now removes subscriptions, stops rendering, disconnects observers and releases scene/control/renderer resources in reverse registration order, including setup failures. Download object URLs are released after the download click has been dispatched.

## Acceptance and review gates

- Unit/integration: 31 new behavioral and integration tests exercise the local read adapter, finite model geometry, bearing provenance, visibility on replacement Three.js objects, selection and actual EventTarget subscriptions. Existing render-loop cleanup wiring test updated for reverse-order disposal.
- Security/RLS: no network, authorization, database or shared project-data change. Reads do not modify local saved records; imported text is rendered through React. Existing security suite remains part of the full run.
- Accessibility: loading/active/focus states and keyboard controls require browser checks below; existing repository contracts also run.
- Mobile/web parity: browser checks at 320, 390, 768 and 1024 px found no horizontal overflow and button targets at least 44 px high; physical mobile devices, virtual keyboards and installed standalone mode are not certified by this change.
- Source/provenance: regression tests ensure references stay attached to their bearing. No new external factual records, vendor claims, prices or laws.
- Professional/religious review: unchanged; planning geometry and entered qibla/source information are not authority or scholarly verification.

## Validation results

- Focused behavioral tests passed; an older cleanup-source assertion was adjusted to the new reverse-order disposal implementation.
- Full test suite: **1003 passed, one pre-existing optional IFC skip** (1004 total). After the final CSS correction, all 56 focused tests passed again.
- Production build / TypeScript: passed again after the inspector CSS correction; all 101 static pages generated.
- Repository validation: passed (63 frames, 6315 normalized features, 20 public routes).
- Privacy scan: passed before and after the documentation/screenshots were added.
- Browser: actual production-build UI verified below.

### Browser evidence

1. Selected the concept building, then hid Building and Constraints. The inspector cleared the hidden selection.
2. Edited the site-evidence form to a width of 55 m, bearing 0° and a synthetic source reference. After refresh, both layer checkboxes remained off and a canvas click selected the visible site, not the hidden building.
3. Opened a second local tab and changed the source reference to `Cross-tab regression study`. The first viewer updated without reload, cleared its stale selection, preserved both hidden layers and showed the new reference when the site was selected again.
4. Switched views using Enter. The active button exposed `aria-pressed=true` and the live status announced `Isometric view applied`.
5. Exported the model through the actual UI. The automation download event timed out, but the file was present in Downloads with the matching timestamp. Parsed JSON confirmed schema `mosque.build/site-coordination-model@1`, seven features, 55 × 64 m working site, 0° bearing, and the correct source reference.
6. No console warnings/errors were captured. Responsive checks covered 320, 390, 768 and 1024 px. The inspector's narrow two-column wrapping was found during this run and corrected; the final build was rechecked at 1024 and 390 px. Inspector values use a single 206 px / 270.8 px column, respectively, and no horizontal overflow or console warnings/errors were observed.

Related broad QA issues #30, #26 and #22 remain open; this release does not complete their full device matrix.

### Screenshots

- [1024 px: hidden layers preserved and readable inspector](qa/2026-11-17/site-refresh-inspector-1024.jpg)
- [390 px: mobile view controls](qa/2026-11-17/site-refresh-mobile-390.jpg)

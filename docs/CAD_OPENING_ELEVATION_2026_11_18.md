# CAD opening elevation validation — 2026-11-18

Status: **executable**. Related to #16 and #29 (geometry validation) and #30 (responsive editor QA); those broader issues remain open.

## Defect and correction

A window above a door on the same wall was rejected as an overlapping opening because validation compared only horizontal offsets and widths. That blocked model import, local recovery and otherwise valid preview commands, despite the renderer already positioning openings using their sill and height.

Collision validation now compares the interiors of both horizontal and vertical intervals in host-wall coordinates. Vertically separated openings and touching edges are not geometric overlaps. Genuine intersections still block commits, imports and invalid history. Messages identify both opening IDs and their host wall so users can locate the conflict.

The selected-opening inspector now shows type, height and bottom/top relative to the level, alongside width and offset, in a compact two-column list. It explains coincident plan marks and distinguishes model dimensions from verified clear passage. Width editing is labeled “opening width”; the model does not calculate door-frame clearance.

No geometry is moved, resized, repaired or saved automatically by this change. Domain objects remain renderer-neutral. Existing Three.js proxies and plan projection are unchanged.

## Acceptance and review gates

- Unit: interval separation, containment, partial intersection, identical bounds, touching edges, different hosts, reversed array order and input immutability.
- Integration: production validation → command preview → commit/cancel/undo; model import; complete-history export/import; local save/reload; invalid historical collision rejection. Three.js proxies retain their distinct heights on an elevated level.
- Security/RLS: no network, authentication or shared-project data changes. Local import, validation and recovery protections remain in force. RLS is not applicable to this local geometry change.
- Accessibility: inspector values use the existing definition list and labeled controls. Collision messages are ordinary text in the existing focused revision-review region; browser checks below cover keyboard behavior and disabled commit state.
- Mobile/web parity: representative browser viewports below. Physical devices, virtual keyboards and installed standalone mode are not certified by these checks.
- Source/provenance: fixtures are synthetic geometry; no external records, local codes, costs or material assumptions added.
- Professional review: absence of geometric collision does not establish adequate lintels, separation, structural capacity, fire safety, accessibility, ventilation or construction feasibility. All require qualified local review. The Three.js representation remains a proxy, not a cut wall or construction detail.

## Verification

- Before the fix: 15 of the 29 new regression tests failed.
- After the fix: all 117 focused tests passed, including the 29 new regressions.
- Full suite: 1,154 passed, one existing optional IFC skip (1,155 total).
- Production build passed, including TypeScript and 101 prerendered pages; the final inspector layout rebuild also passed. No standalone lint script is configured.
- `pnpm validate`, `pnpm privacy:scan` and `git diff --check` passed.
- Browser import: a synthetic 7-wall, 2-opening, 2-room model passes the explicit file review and replacement flow. The high window shows a 2.50 m bottom, 0.80 m height and 3.30 m top relative to the level.
- Browser editing: a window move from 3.20 m to 3.50 m previews and commits using the keyboard. A new door intersecting the existing door produces a named collision and disables commit. Cancel preserves the model and restores focus to the preview trigger; undo/redo restores the window's offsets. Reload retains the 3.50 m offset and undo history.
- Browser widths 320/390/768/1,024/1,440 px: no page-level horizontal overflow or review-message overflow. Commit/cancel controls are at least 44 px high. Revision review receives focus; keyboard focus on the inspector has a visible 3 px outline.
- Final compact inspector rechecked at 320/390/768/1,024 px: two columns, no overflowing data cells or page-level overflow. Saved opening values remain intact after the rebuild and reload.
- No console warnings/errors recorded during this flow. No API, backend or external credentials are involved; persistence is local to the tested browser origin.
- Evidence: [mobile collision](qa/2026-11-18/cad-opening-collision-390.jpg), [mobile inspector](qa/2026-11-18/cad-opening-inspector-390.jpg), [desktop inspector](qa/2026-11-18/cad-opening-inspector-1024.jpg).

# CAD editor correctness and mobile review

Status: **executable**. Related GitHub issues: [#30](https://github.com/ummahbuild/mosque.build/issues/30), [#26](https://github.com/ummahbuild/mosque.build/issues/26), [#22](https://github.com/ummahbuild/mosque.build/issues/22). This is a bounded CAD workflow fix, not completion of the full device matrix or the multi-level authoring feature in #29.

## Reproduced problems and changes

- Explicit zero wall thickness, wall height and door height previously fell back to plausible defaults. Zero now reaches geometry validation and blocks the revision.
- Blank, missing, boolean, string and non-finite numeric command inputs are rejected before geometry is changed. Optional defaults apply only when fields are omitted.
- Zero offsets and negative level elevations retain their valid meanings.
- Pending previews cannot be replaced by a second core command or discarded through core undo/redo.
- The production validator now blocks the 501st wall/opening or 301st space before committing a model that browser restore would reject.
- The editable 2D plan now shows hosted openings at their actual offsets and widths, including reversed and diagonal host directions.
- Walls and openings have larger pointer targets, keyboard activation and announced selected states. Native select controls remain available as an alternative to selecting geometry.
- The plan's accessible name uses the actual authored level name.
- Commit/cancel controls appear above the drawing rather than below the long inspector. Previewing focuses this review panel; committing or cancelling returns focus to the initiating control without forcing another scroll.
- Blocking geometry messages appear beside the disabled commit button.
- Review controls wrap on narrow screens and no longer stick over the drawing or inputs.
- The 3D camera fits once per model/reset instead of resetting when the viewport or virtual keyboard changes size.
- Graphics cleanup is registered as resources are created, so partial initialization failures can release the renderer and controls.

## Test gates

| Gate | Evidence / boundary |
| --- | --- |
| Unit | `tests/cad-editor-commands.test.mjs`: 26 executed command/projection regressions; `tests/cad-plan-view.test.mjs`: two rendered accessibility/target-bounds regressions. |
| Integration | Existing CAD command, geometry, local restore, import/export, stale-tab and history tests; full repository suite. |
| Security/RLS | Numeric and size limits covered; no server API, shared project data or RLS changes. Existing storage protection remains in place. |
| Accessibility | Browser keyboard activation, focus movement, selected states, alternative native selectors and control readability. Full screen-reader certification remains outstanding. |
| Mobile/web | Browser viewport checks for the editor, review and schedules. Physical touch keyboard and installed Android/iOS checks remain outstanding. Native mobile app unchanged. |
| Source/provenance | No new external records, prices, laws or religious material. Synthetic geometry only. |
| Professional review | Dimensions, room use, structure, fire safety and accessibility remain conceptual and require qualified local review. |

## Limits

The drawing workspace still authors a single level. Openings in the 3D view remain labeled proxy solids, not boolean-cut construction geometry. This patch does not claim IFC certification, multi-level CAD completion, code compliance, or closure of the broad mobile QA issues.

## Browser evidence

Tested the local production build on an isolated localhost origin with a synthetic starter plan:

- Loaded and committed the starter; resized its doorway from 1.2 m to 1.5 m; undid, redid and reloaded. Revision 2 and the 1.5 m schedule survived reload.
- Zero opening width showed a blocking message beside a disabled commit button. Cancelling returned focus to the resize control.
- Doorway click, wall Space and doorway Enter selected the corresponding inspector and updated `aria-pressed`.
- Plan page widths 320, 360, 390, 430, 768, 1024 and 1440 px had document width equal to viewport width.
- Schedule widths 320, 390, 768, 1024 and 1440 px retained internal horizontal table scrolling and keyboard-focusable regions without page overflow.
- Schedule inspection returned to the selected doorway. The 3D viewer displayed saved revision 2 and reset successfully.
- No browser warning/error entries appeared during these checks. A temporary local server restart exercised the existing offline fallback; reloading after restart restored the page and saved model.

Physical-device virtual keyboard, native mobile and installed standalone checks remain open. The wider issue #22 route matrix is not claimed complete.

## Release checks

Local final validation: `pnpm test` — 736 total, 735 passed, one existing optional external IFC-parser test skipped. `pnpm validate`, `pnpm privacy:scan`, `pnpm web:build` (including TypeScript and 101 generated pages), and `git diff --check` passed. No lint script is configured.

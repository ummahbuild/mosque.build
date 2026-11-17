# CAD recovery and editor bug fixes — 2026-11-11

Related: [#12 legacy starter recovery](https://github.com/ummahbuild/mosque.build/issues/12), [#22 responsive QA](https://github.com/ummahbuild/mosque.build/issues/22), [#26 responsive QA](https://github.com/ummahbuild/mosque.build/issues/26), [#30 device QA](https://github.com/ummahbuild/mosque.build/issues/30).

Status: **executable**. These fixes do not make conceptual CAD a professionally reviewed construction or BIM authoring system. The wider responsive issues remain open; this pass covers the CAD editor and shared navigation, not every module or physical device.

## Verified defects and resulting behavior

1. The exact historical five-wall starter is recognized from its schema, IDs, geometry, names, spaces and opening host.
2. Recognition allows dates/revision counters to differ, but rejects changed geometry or semantic fields.
3. A repair preview explains the two perimeter splits before confirmation.
4. Repaired prayer/support boundaries close correctly, with unchanged 64 m² and 32 m² areas.
5. Door geometry and the wall-5 host remain unchanged.
6. A repaired model can be downloaded before changing saved data.
7. Replacement writes an exact original-record backup first.
8. Backup quota failures abort replacement.
9. Rollback restores original bytes, including malformed or legacy records, into protected recovery.
10. Modified legacy plans remain available for download and manual investigation.
11. Valid undo/redo snapshots survive reload instead of being silently discarded.
12. Recognized legacy history is repaired only when every snapshot is valid or an exact historical match.
13. Malformed, oversized and unknown-schema saved records remain protected.
14. The size limit counts UTF-8 bytes, including multibyte input.
15. A failed initial storage read no longer authorizes an empty-state overwrite.
16. Loading or selecting an element no longer rewrites the model unnecessarily.
17. Saves compare the last-read record with current storage and reject stale tabs.
18. Other-tab changes are reported in the editor; explicit reload is available.
19. Save failures display an unsaved state instead of claiming all changes are saved.
20. Import, repair and reset are explicit replacements with a previous-record backup.
21. File-read failures are caught, and invalid subsequent imports clear stale import previews.
22. Imported schema/status values are checked instead of silently coerced.
23. Unknown wall phases, opening/space kinds, wrong level references and nonnumeric areas are rejected.
24. Stored space areas that differ from calculated geometry are blocked.
25. Rooms with fewer than three boundary walls are blocked.
26. Production preview retains no-op blockers rather than creating empty revisions.
27. A pending preview cannot be silently replaced by loading another starter.
28. Empty/invalid wall and door dimensions no longer silently become zero/default dimensions.
29. Wall selection has a native select alternative to thin SVG targets; changing selection clears stale property edits.
30. Interactive plan children are exposed through a group instead of a flattened image role.
31. Schedule entries use keyboard-operable inspection buttons and labelled scroll regions.
32. Level fields show current values as placeholders instead of presenting unrelated fixed defaults as edits.
33. Inputs, selects and recovery buttons fit narrow layouts; long actions wrap.
34. Small-screen commit controls no longer cover the editor as a large sticky panel.
35. Walls render with visible thickness; selected-wall styling remains in model units rather than a five-metre highlight.
36. The 3D view responds to cross-tab changes and clears stale/invalid models.
37. Graphics initialization failures/context loss show a fallback and retry control.
38. Camera framing uses model bounds instead of a fixed starter-plan target.
39. Rendering occurs on view changes rather than an endless animation loop; unchanged storage events do not rebuild the scene.
40. Keyboard panning, renderer/control cleanup and zero-size resize guards are included.
41. Three-dimensional walls and openings respect authored level elevation.
42. Desktop navigation shows one Design studio entry while compact navigation retains its shortcut.
43. Browser-navigation warnings protect pending previews and unsaved committed changes.
44. Normal model exports are disabled during recovery so an empty fallback is not mistaken for recovered work.

## Acceptance and verification

- Unit/integration: `tests/cad-local-recovery.test.mjs` runs real domain/storage functions and the Three adapter. The historical fixture is from the parent of `de4819f`; it contains no personal data.
- Security/data integrity: exact fingerprint; unsupported schema/enums; invalid history; byte bounds; stale saves/rollback; failed reads/writes; backup-first replacement; no network persistence or new shared-project authorization paths.
- Browser integration: production build on an isolated localhost origin, synthetic data only. Starter preview/commit, wall rename, undo after reload, legacy file import, backup rollback, stale-tab rejection, project-package restore of the original five-wall record, explicit repair and reload were exercised through visible controls.
- Accessibility: semantic controls, Enter-key schedule selection, live save/recovery status, visible focus styles and wrapping actions checked. No screen-reader or physical-device certification is claimed.
- Responsive: 320, 360, 390, 430, 768, 1024 and 1440px; no document overflow or out-of-bounds editor controls in the checked views. Recovery checked at 320px. Installed iOS/Android standalone, virtual keyboards and notches remain device-level review gates.
- Automated gates: full repository tests, TypeScript/production build, validation and privacy scan. One existing optional external IFC-parser test remains skipped. There is no lint command in package.json.
- External provenance: no new external architectural, cost, legal, religious or vendor assertions were added.
- Human/professional review: conceptual dimensions, structure, openings, access/fire/MEP compliance and exported geometry still require qualified review. These fixes make no Revit/IFC or construction-readiness claim.

## Remaining work

- Physical WebKit/iOS/Android keyboard, standalone and assistive-technology QA for #22/#26/#30.
- Source-evidence spans and expanded multilingual ambiguity fixtures for #15/#17/#20.
- Parametric concept-to-CAD allocation work for #16/#29.
- Explicit multi-document storage and browser-tab locking if simultaneous collaborative editing is introduced. Current compare-before-write checks protect normal stale-tab saves; localStorage is not an atomic collaborative database.
- Backup is the previous saved record, not an unlimited archive. Download important versions before additional replacements.

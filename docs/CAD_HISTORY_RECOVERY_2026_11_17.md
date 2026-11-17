# CAD backups preserve history and explain replacement

Status: **executable**. Completes the browser import/restore verification for [issue #12](https://github.com/ummahbuild/mosque.build/issues/12), building on the existing exact-geometry legacy repair. Responsive evidence contributes to [#30](https://github.com/ummahbuild/mosque.build/issues/30); the wider device matrix remains open.

## Problems addressed

- Importing a full saved CAD record previously passed through the model-only importer, which reset undo and redo arrays. Invalid history could therefore be silently ignored while the current document was accepted.
- Full backups now validate every current, past and future document together. Valid history is preserved. Damaged history, missing state fields and unfinished transactions are rejected without falling back to the current geometry.
- Model-only exports remain supported, with an explicit explanation that they start a new history. **Export model + history** produces a bounded, validated full recovery file. Both export choices explain their scope.
- A named import preview shows model counts, undo/redo counts and any recognized legacy repair. Focus moves to the review region. Cancel returns focus to the import action. Model-changing actions pause during import review; exporting the current model remains available.
- Cancel, reload, successful replacement and unmount invalidate pending reads. A newer file selection wins over an older result or failure. Oversized files are rejected before reading and actual UTF-8 bytes are checked afterward.
- Existing compare-before-write, exact-original backup and rollback protections remain in place. Modified historical plans are never repaired automatically.
- Browser testing found a schematic controls column extending beyond the page at 1024 px. Its fieldsets, grid tracks and select control now shrink within their allocated column instead of forcing page overflow.

## Acceptance and verification

- **Unit/integration:** 26 new tests cover history preservation, model-only distinction, export/import round trips, missing or damaged histories, pending transactions, exact legacy repair across snapshots, modified legacy rejection, byte limits, exact backup/rollback, stale storage, cancellation and out-of-order reads. Two existing source-wiring checks were updated for the new importer and strengthened edit lock. Full suite: 953 passed, one existing independent IFC test skipped, zero failures.
- **Browser, production build:** Cancel preserved the empty model and returned focus. Confirming a full backup with Enter restored seven walls with one undo and one redo revision; exporting retained both. After reload, Undo returned to the empty document and Redo restored the seven-wall model. Invalid history produced an error without an import preview; model-only input displayed its history limitation.
- **Legacy recovery:** A synthetic historical record was loaded through the local project-package UI. Before repair, downloading returned the exact stored original. Explicit repair produced seven walls, unchanged room areas of 64 m² and 32 m², and the door still hosted on wall-5. Restoring the previous saved model returned to recovery, and its downloaded bytes exactly matched the original. No production records were changed.
- **Accessibility/responsive:** Focus management, keyboard confirm/cancel, accessible review region, visible history explanations and 44 px or larger replacement controls were exercised. Six viewport widths: 320, 360, 390, 430, 768 and 1024 px. The final screenshot set records the corrected layout; document scroll width exactly matched all six viewport widths (no page-level horizontal overflow). Physical-device, virtual-keyboard and screen-reader testing remain manual gates.
- **Runtime:** No console warnings/errors in the completed local recovery flow. The large design page caused intermittent browser-control timeouts; fresh state checks and a fresh local tab allowed the flow to complete. This is not a performance certification.
- **Build/checks:** Production build including TypeScript, repository validation, privacy scan and whitespace checks. No standalone lint script is configured.
- **Security/RLS:** No API, shared project data, authentication or database changes; RLS tests are not applicable. Files remain data, never executable content. No dependencies or external factual records added.
- **Professional boundary:** This remains conceptual CAD. No structural, accessibility, fire, IFC or native Revit certification is claimed.

## Screenshots

[320 px](qa/2026-11-17/cad-history-import-320.png) · [360 px](qa/2026-11-17/cad-history-import-360.png) · [390 px](qa/2026-11-17/cad-history-import-390.png) · [430 px](qa/2026-11-17/cad-history-import-430.png) · [768 px](qa/2026-11-17/cad-history-import-768.png) · [1024 px](qa/2026-11-17/cad-history-import-1024.png)

[Corrected schematic controls at 1024 px](qa/2026-11-17/schematic-controls-1024.png).

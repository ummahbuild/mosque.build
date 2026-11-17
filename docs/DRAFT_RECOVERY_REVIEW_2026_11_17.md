# Review a repaired brief before replacing saved work

Status: **executable**. Follow-up to [issue #25](https://github.com/ummahbuild/mosque.build/issues/25); responsive evidence also supports the recovery portion of [#30](https://github.com/ummahbuild/mosque.build/issues/30). This does not mark the broader device matrix complete.

## Verified problems and changes

- The previous recovery file input replaced the saved brief as soon as a valid file finished reading, after a general replacement checkbox. Choosing a file now opens a named preview with project, location, type, attendance, budget and program fields, plus an expandable complete normalized brief. Only **Restore reviewed brief** writes it.
- A canceled or superseded asynchronous file read could complete later. A generation guard now ignores older success and error results; cancel, withdrawal of consent, retry and unmount invalidate pending reads. Reading has a visible status and cancellation action.
- A schema-valid brief containing heavily escaped text could serialize beyond the wizard's 100,000-character restore limit. Ordinary saves, recovery uploads and project-package imports now reject that case before replacing saved work. Valid multilingual text and ordinary newlines remain lossless. Original and previous backup slots remain unchanged when serialization is rejected.
- Unknown file versions, invalid fields, unreadable files and oversized uploads have actionable errors. An oversize file is rejected before reading, and the actual UTF-8 size is also checked after reading.
- A failed storage write keeps the preview available. Existing stale-tab and exact-original-backup guards still apply at commit time.

## Acceptance and test evidence

- **Unit/integration:** 20 new tests for raw/export/legacy files, unsupported schemas and fields, read failures, UTF-8 limits, serialization limits, exact backups, unrelated-record preservation, stale snapshots, cancellation and out-of-order reads. Full suite: 927 passed, one existing IFC test skipped, zero failures.
- **Browser integration:** On an isolated local origin, a temporary local-only fixture placed a synthetic malformed brief into storage through a visible setup button. The harness was removed before commit. Choosing a repaired file did not replace the original: downloading it still returned the exact text `{synthetic original QA`. Cancel removed the preview. An invalid file displayed its error and a subsequent valid selection worked. Confirming with Enter restored the brief; reload retained project name, attendance 120 and budget EUR 750000.
- **Package boundary:** A project package containing a valid-shaped but oversized serialized brief was rejected before replacement. Exporting the saved brief afterward confirmed the repaired project values were unchanged.
- **Accessibility:** Preview focus moved to its heading, fields and file input had labels, errors were announced, full-field text was keyboard-focusable, and restore worked with Enter. Primary action height measured 46.5 px.
- **Responsive:** 320, 360, 390, 430, 768 and 1024 px had no page-level horizontal overflow. Real browser screenshots are linked below. Browser viewport was reset afterward.
- **Console:** No warnings or errors in the exercised local recovery flow.
- **Build/checks:** Production build including TypeScript, repository validation, privacy scan and whitespace checks. No standalone lint script is configured.
- **Security/RLS:** No API, authentication, database or shared project data changes; RLS tests are not applicable to this local-only flow. Files are parsed as data and never executed. No new dependencies or external records.
- **Review gates:** Physical-device, native virtual-keyboard and screen-reader verification remain manual gates. No financial, structural, legal, religious or construction approval claims are added.

## Screenshots

[320 px](qa/2026-11-17/draft-recovery-320.png) · [360 px](qa/2026-11-17/draft-recovery-360.png) · [390 px](qa/2026-11-17/draft-recovery-390.png) · [430 px](qa/2026-11-17/draft-recovery-430.png) · [768 px](qa/2026-11-17/draft-recovery-768.png) · [1024 px](qa/2026-11-17/draft-recovery-1024.png)

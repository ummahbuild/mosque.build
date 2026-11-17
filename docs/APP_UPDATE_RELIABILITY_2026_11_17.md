# App update and offline reliability — 17 November 2026

Status: **executable**. These changes improve browser update/recovery behavior; they do not certify the whole product or physical installed-device parity.

## Problems corrected

- A worker activated from another tab previously caused every already-controlled tab to reload. The new controller records explicit consent in the requesting tab only. Other tabs retain their current work and offer a manual reload.
- Initial installation no longer triggers a reload, while subsequent updates are still observed.
- Controller-change notifications are deduplicated by worker identity, without disabling notifications for later releases.
- Already-installing and waiting workers are both observed, including a registration that resolves after an update started.
- Registration, worker and controller listeners are removed on unmount. A late registration result cannot update an unmounted component.
- Redundant workers, failed update messages and a 15-second activation timeout release pending controls and give a recovery message. Late activation after timeout requires explicit reload.
- Install prompt acceptance, dismissal and failure settle without unhandled rejections. Single-use events are discarded, repeated clicks are guarded, and `appinstalled` removes the install offer.
- Development cleanup unregisters only registrations containing this app's exact worker URL, preserving unrelated workers on the same origin.
- The offline notice is dismissible and participates in normal layout instead of covering header navigation.
- Update/install notices use scoped styles, visible keyboard focus, safe-area offsets and at least 44 px controls. Removed 16 obsolete global selectors (global CSS reduced from 179,293 to 177,799 bytes).
- The standalone offline response now declares its language, uses readable responsive text and safe-area padding, and provides separate current-page retry and home actions. The retry preserves the original route and query.
- Worker shell version advances to v26 so the new offline response is installed.

Cross-tab protection applies to tabs running this release. Previously loaded application versions retain their old client behavior until reloaded. Save/download unsaved work before accepting an update.

## Verification

| Gate | Evidence |
| --- | --- |
| Unit/lifecycle tests | 12 new executed tests in `tests/app-update-controller.test.mjs`: explicit vs remote activation, initial install, unrelated worker, listener cleanup, delayed registration, updatefound, failure/timeout, repeated releases, scoped cleanup, install outcomes. |
| Full suite | 843 passed; one existing independent IFC validation/tessellation test skipped; zero failures. |
| Integration | Production build served through a localhost-only QA proxy with two actual service-worker versions. An update chosen by keyboard in one tab reloaded that tab. Another tab retained its unsaved synthetic concept and displayed “Reload now”; dismissal also retained the text. |
| Offline recovery | Stop the QA origin, visit `/design?qa=offline`, verify cached offline HTML, restart the origin, click “Try this page again”, and verify the same path/query loads the floor-plan editor. |
| Accessibility | Semantic status/error messages, accessible dismiss names, keyboard update activation, visible 3 px focus outline, language declaration, 44 px update controls and approximately 54 px offline links. This is not a screen-reader certification. |
| Responsive browser | 320, 360, 390, 430, 768 and 1024 px widths: update prompt stays within viewport, controls remain visible, no page overflow; offline response passes the same widths. Screenshots linked below. |
| Console | No warnings/errors in the exercised local browser flows. |
| Repository checks | Validation, privacy scan and production build (including TypeScript) passed. No separate lint script is configured. |
| Dependency audit | Locked web dependency audit reported no known vulnerabilities on 2026-11-17. |
| Security/RLS | No API, authentication, database or project storage changes. RLS tests are not applicable to this local lifecycle change. Exact worker ownership and cleanup isolation have executed tests. |
| Provenance/professional review | No external factual records, regulatory calculations or religious content added. Existing professional review gates remain unchanged. |

Physical Android/iOS standalone behavior, virtual keyboards, device safe-area emulation and browser-native installation UI remain manual review gates. Install failures are covered by executed unit tests, not by a browser-native installation test. The broader QA issues [#22](https://github.com/ummahbuild/mosque.build/issues/22), [#26](https://github.com/ummahbuild/mosque.build/issues/26) and [#30](https://github.com/ummahbuild/mosque.build/issues/30) remain open. The scoped CSS extraction is a limited contribution toward [#23](https://github.com/ummahbuild/mosque.build/issues/23), not a complete stylesheet migration.

## Browser evidence

All images are captures of the local production build with synthetic inputs; no production project records were changed.

- [Unsaved text retained after another tab updates](qa/2026-11-17/unsaved-work-preserved-390.png)
- Update prompt: [320](qa/2026-11-17/update-ready-320.png), [360](qa/2026-11-17/update-ready-360.png), [390](qa/2026-11-17/update-ready-390.png), [430](qa/2026-11-17/update-ready-430.png), [768](qa/2026-11-17/update-ready-768.png), [1024](qa/2026-11-17/update-ready-1024.png)
- Offline response: [320](qa/2026-11-17/offline-320.png), [360](qa/2026-11-17/offline-360.png), [390](qa/2026-11-17/offline-390.png), [430](qa/2026-11-17/offline-430.png), [768](qa/2026-11-17/offline-768.png), [1024](qa/2026-11-17/offline-1024.png)

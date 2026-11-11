# Workspace navigation and keyboard access fixes

Status: **executable**. Follow-up to GitHub [#22](https://github.com/ummahbuild/mosque.build/issues/22), [#26](https://github.com/ummahbuild/mosque.build/issues/26), [#30](https://github.com/ummahbuild/mosque.build/issues/30), and the conflicting CSS portion of [#23](https://github.com/ummahbuild/mosque.build/issues/23). These broad issues remain open; this is not completion of all device QA or a full CSS decomposition.

## Findings and implementation

The shared planning navigator is used by design, marketplace, construction and operations.

- The dropdown was clipped by `content-visibility:auto` on its containing aside: the button reported expanded while the search and links were invisible. The navigator now remains fully laid out and uncontained.
- Interactive modules also used estimated intrinsic heights. During a long-distance jump these heights changed as sections entered view, leaving the user several tools before the requested destination. Interactive workspace sections now retain their actual sizes. Card grids retain their existing deferred rendering.
- Sticky page navigation and tool navigation shared the same top offset. The tool navigator now measures the actual header and page navigation heights, including responsive changes.
- Scroll work is coalesced into animation frames; observers and listeners are cleaned up on unmount.
- Tool destinations use real fragment links. Normal activation updates history and moves focus to the destination; modified clicks retain browser link behavior. Back/Forward and direct fragment navigation resolve the same DOM targets.
- Duplicate generated/existing tool anchors are assigned unique IDs instead of calculating an unused replacement. Unicode headings and malformed percent-encoded fragments are handled safely.
- Search supports multiple terms, reordered terms and Latin diacritics. Clear-search controls and result counts make empty states recoverable.
- Escape and Close return focus to the toggle. Outside pointer actions and tabbing out dismiss the disclosure. The menu is non-modal and does not trap keyboard focus.
- Menu height follows the available viewport, including visual-viewport resize events where supported. The panel scrolls internally and respects bottom safe-area padding.
- The menu is excluded from browser scroll-anchor selection so result-list changes do not move the underlying reading position.
- Active-section updates no longer continuously announce every scroll change to screen readers.
- The compact site menu previously closed at 1100 px although CSS kept the full desktop navigation hidden through 1320 px. It now follows the actual toggle visibility and restores focus to desktop navigation when necessary.
- A global cursor rule applied `not-allowed` to every button. Enabled buttons now use a pointer; disabled controls retain the disabled cursor.
- The layout's skip-link target wrapped both navigation and content, and duplicated the ID on the studio route. Every page/component rendering a main landmark now gives that landmark the unique, focusable `main-content` ID. The outer wrapper no longer claims that ID.

## Test gates

| Gate | Evidence / limitation |
| --- | --- |
| Unit | Executed ID generation, Unicode, malformed fragments, search and scroll-offset cases in `tests/workspace-navigation.test.mjs`. |
| Integration | Main-landmark contract across all 34 route/component sources, existing navigation tests and full repository suite. |
| Accessibility | Browser tests for menu search, Escape, destination focus, native fragment links, skip-to-main and compact/desktop menu focus. Full screen-reader certification remains open. |
| Mobile/web | Responsive browser checks on the shared workspaces; native app unchanged. Physical iOS/Android keyboards and installed standalone testing remain open. |
| Security/RLS | No new APIs, storage, shared records or permission changes. Destination lookup is restricted to the current workspace. |
| Source/provenance | No new factual, legal, cost or religious records. |
| Professional review | This changes navigation only. Existing conceptual planning and professional-review boundaries remain in force. |

## Scope and tradeoff

Keeping the large interactive workspace sections laid out trades some offscreen layout savings for predictable navigation. It does not eagerly load new data or new 3D assets. Further performance work should isolate and lazily initialize expensive viewers without substituting unstable heights for interactive destinations.

## Verification results

- Final production build and TypeScript checks passed; 101 pages generated.
- Full suite: 746 tests, 745 passed, one existing optional external IFC-parser test skipped.
- Repository validation, privacy scan (1336 files), and diff whitespace check passed. No lint script is configured.
- Construction deep links tested freshly at 320, 360, 390, 430, 768, 1024 and 1440 px: no page overflow, toolbar top aligned with page-navigation bottom, destination about 16 px below the tools bar.
- Design (51 tools), marketplace (3 tools), operations (5 tools) and construction (17 tools) exposed visible menu links at mobile width.
- Real native pointer and keyboard input kept the cost-tool reading position at 230.4 px while opening and filtering the menu. Escape returned focus to the toggle.
- A 390 × 400 short viewport kept the panel bottom at 387 px, with 172 px of internal scrolling space for its 594 px content.
- Browser Back, multi-term search, empty results, clear search, selected destination focus and skip-to-main were checked. The compact header stayed open from 1200 to 1250 px and closed at 1440 px with focus transferred to desktop navigation and body scrolling restored.
- Final browser checks showed no warnings/errors. Testing changed navigation/search state only, not user project fields.

Browser evidence screenshot: `/tmp/mosque-build-planning-menu-mobile.jpg` in the local QA session. Physical-device and screen-reader testing remain explicitly uncompleted.

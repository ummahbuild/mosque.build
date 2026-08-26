# Pattern library and lifecycle process

Status: `executable` local PWA interaction, with conceptual design content.

The `/patterns` route provides original CSS-rendered geometric, material and spatial studies. It deliberately does not present products, vendors, prices, performance claims, religious rulings or sacred calligraphy. Each record includes a repository source path, observed date, rights statement, confidence, feature status and review prompts. Shortlists stay in browser storage under `mosque-build.pattern-shortlist.v1`.

The `/my-project` route now continues the saved onboarding brief through eight visible lifecycle stages: brief, site, design, approvals, funding, sourcing, construction and operations. Stage controls expose preparation prompts and route into existing product areas; they do not claim stage completion or approval.

Product-area hero previews are now interactive: users can change the represented workspace feature and reveal connected decisions with mouse, touch or keyboard. These previews remain explanatory prototypes rather than saved server-side project records.

## Verification declaration

- Unit/data tests: `tests/pattern-library.test.mjs`
- Integration/build: application validation, TypeScript and Next.js production build
- Accessibility: native buttons, tab semantics, visible focus, live result/detail text, 44px minimum controls, reduced-motion handling
- Mobile/web parity: responsive grid, horizontal lifecycle control, single-column preview and inspector
- Source/provenance: required metadata test for every gallery record
- Review gates: structural, fire, acoustic, accessibility, slip, authority and religious-review boundaries are explicit where relevant

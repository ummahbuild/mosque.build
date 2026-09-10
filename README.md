# mosque.build

mosque.build is an open-source planning and design workspace for the full life of a mosque: community brief, site selection, conceptual design, approvals, budget, funding, sourcing, construction, opening, operations, endowment, adaptation, and care.

[Website](https://mosque.build) · [Getting started](#run-locally) · [Contributing](CONTRIBUTING.md) · [Architecture](docs/ARCHITECTURE.md) · [Routes and features](docs/ROUTES_AND_FEATURES.md) · [Marketing library](marketing/README.md) · [Security](SECURITY.md)

## Why mosque.build exists

Mosque projects are often managed across disconnected documents, chats, drawings, spreadsheets, and institutional memory. mosque.build brings those decisions into one evidence-aware journey so communities can prepare better questions, compare options, preserve context, and coordinate qualified professionals.

It does not replace architects, engineers, quantity surveyors, planners, legal advisers, authorities, religious scholars, contractors, or community governance. Regulated and safety-critical outputs remain conceptual until reviewed by the appropriate qualified people.

## What is available today

The current web application includes:

- a six-step private project brief saved in the browser;
- a connected project dashboard and lifecycle action plan;
- site, qibla, climate, access, land-cost, and resilience studies;
- editable room, floor-plan, massing, roof, dome, opening, structure, wudu, women’s-space, interior, solar, energy, and building-systems tools;
- interactive Three.js inspection views backed by renderer-neutral project records;
- prayer-row, occupancy, daylight, and spatial-volume studies;
- source-labelled Islamic architecture, lineage, material, and geometric-pattern studies;
- likely permit and funding pathways with jurisdiction and verification boundaries;
- product research, procurement planning, quote comparison, and cost-control tools;
- schedules, construction packages, site logs, document control, changes, evidence, and handover planning;
- operations, maintenance, work-order, privacy, and emergency-readiness planning;
- 40 lifecycle guides, source records, and 63 visual project examples;
- installable, responsive, offline-aware delivery for previously visited public pages;
- exportable local project records with review boundaries attached.

Not every item in the feature registry is implemented. mosque.build uses explicit statuses instead of a single “done” flag:

`concept | specified | scaffolded | executable | source_backed | beta | production_ready`

See [Routes and features](docs/ROUTES_AND_FEATURES.md) for the implemented public surface and [Next build](docs/NEXT_BUILD.md) for current priorities.

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Three.js for interactive model views
- CSS with shared design tokens
- browser-local persistence and JSON export
- service worker, web manifest, and responsive install experience
- Node.js test runner and repository validation scripts
- Supabase schema and Row Level Security migration drafts for future shared projects

Canonical domain objects remain independent of Three.js. Portable interchange targets include glTF/GLB for rendered assets, IFC for building-model exchange, and GeoJSON/vector tiles for mapping.

## Run locally

Requirements:

- Node.js 22 or newer
- pnpm 10

```bash
git clone https://github.com/ummahbuild/mosque.build.git
cd mosque.build
pnpm install
pnpm web:dev
```

Open `http://localhost:3000`.

Run the complete verification sequence:

```bash
pnpm test
pnpm validate
pnpm privacy:scan
pnpm web:build
```

| Command | Purpose |
|---|---|
| `pnpm web:dev` | Start the Next.js development server using the [root scripts](package.json) and [web package](apps/web/package.json) |
| `pnpm web:build` | Type-check and create the production web build configured in [apps/web/package.json](apps/web/package.json) |
| `pnpm test` | Run the repository, domain, UI-contract, provenance, and security suites in [tests](tests) |
| `pnpm validate` | Validate registries, routes, linked assets, and product contracts with [scripts/validate.mjs](scripts/validate.mjs) |
| `pnpm privacy:scan` | Scan repository files using [scripts/privacy-scan.mjs](scripts/privacy-scan.mjs) |

## Repository structure

```text
mosque.build/
├── apps/web/                 Next.js application
│   ├── app/                  Routes, metadata, and route-level styles
│   ├── components/           Shared UI and interactive planning tools
│   ├── data/                 Runtime reference datasets
│   ├── lib/                  Domain calculations, persistence, and integration logic
│   └── public/               Manifest, service worker, icons, flags, and public assets
├── packages/
│   ├── domain/               Renderer-neutral shared domain types
│   ├── algorithms/           Historical and reusable calculation modules
│   └── ui/                   Shared design tokens
├── data/                     Canonical registries and implementation waves
├── tests/                    Node-based test suites and repository contracts
├── scripts/                  Validation, privacy, and smoke-test tooling
├── supabase/                 Schema, RLS, and security migration drafts
├── assets/                   Source visual assets and rights-sensitive references
├── docs/                     Product, architecture, audit, and implementation documentation
└── archive/source-seeds/     Historical research inputs retained for traceability
```

Read [Repository map](docs/01_REPOSITORY_MAP.md), [Architecture](docs/ARCHITECTURE.md), and [Asset policy](docs/ASSET_POLICY.md) before making structural or visual changes.

### Browse the code on GitHub

| Area | GitHub path | What lives there |
|---|---|---|
| Web application | [apps/web](apps/web) | The active Next.js product |
| Routes | [apps/web/app](apps/web/app) | Pages, layouts, metadata, sitemap, manifest, and route styles |
| Components | [apps/web/components](apps/web/components) | Shared navigation, forms, planning tools, and Three.js views |
| Web logic | [apps/web/lib](apps/web/lib) | Calculations, safe parsing, record contracts, exports, and workflow integration |
| Runtime data | [apps/web/data](apps/web/data) | Jurisdictions, products, patterns, architecture, costs, and resources used by the app |
| Public files | [apps/web/public](apps/web/public) | Install icons, flags, service worker, and public visual assets |
| Shared domain | [packages/domain](packages/domain) | Renderer-neutral TypeScript domain types |
| Algorithms | [packages/algorithms](packages/algorithms) | Reusable and historically versioned calculation modules |
| Design tokens | [packages/ui/tokens.json](packages/ui/tokens.json) | Shared interface colours, spacing, and typography values |
| Canonical data | [data](data) | Feature, frame, implementation-wave, dependency, and source registries |
| Tests | [tests](tests) | Domain, UI-contract, accessibility, provenance, privacy, and integration tests |
| Tooling | [scripts](scripts) | Validation, privacy scanning, and functional smoke checks |
| Database drafts | [supabase](supabase) | Schema, Row Level Security, and security migration drafts |
| Documentation | [docs](docs) | Architecture, product, testing, audits, sources, and development plans |
| Marketing | [marketing](marketing) | Community, contributor, campaign, history, and editorial content |
| Asset sources | [assets](assets) | Rights-sensitive source and visual assets |
| Historical sources | [archive/source-seeds](archive/source-seeds) | Traceability inputs that are not runtime truth |
| GitHub workflow | [.github](.github) | Issue forms and the pull-request template |

## Main routes and source files

| Route source | Live page | Purpose |
|---|---|---|
| [Home](apps/web/app/page.tsx) | [mosque.build](https://mosque.build/) | Product overview and interactive mosque-build sequence |
| [Start](apps/web/app/start/page.tsx) | [Open `/start`](https://mosque.build/start) | Guided private project brief |
| [My project](apps/web/app/my-project/page.tsx) | [Open `/my-project`](https://mosque.build/my-project) | Connected project overview, actions, schedule, records, and exports |
| [Design](apps/web/app/design/page.tsx) | [Open `/design`](https://mosque.build/design) | Site, architecture, floor planning, 3D, interiors, systems, energy, and accessibility |
| [Patterns](apps/web/app/patterns/page.tsx) | [Open `/patterns`](https://mosque.build/patterns) | Source-labelled architecture lineages, materials, and geometric studies |
| [Permits](apps/web/app/permits/page.tsx) | [Open `/permits`](https://mosque.build/permits) | Likely permit pathways and authority-source records |
| [Funding](apps/web/app/funding/page.tsx) | [Open `/funding`](https://mosque.build/funding) | Funding, charity, and waqf starting points by jurisdiction |
| [Marketplace](apps/web/app/marketplace/page.tsx) | [Open `/marketplace`](https://mosque.build/marketplace) | Product research, procurement planning, and quote comparison |
| [Construction](apps/web/app/construction/page.tsx) | [Open `/construction`](https://mosque.build/construction) | Cost, schedule, coordination, evidence, and handover planning |
| [Operations](apps/web/app/operations/page.tsx) | [Open `/operations`](https://mosque.build/operations) | Opening, assets, maintenance, work orders, and emergency readiness |
| [Resources](apps/web/app/resources/page.tsx) | [Open `/resources`](https://mosque.build/resources) | Searchable lifecycle guidance |
| [Examples](apps/web/app/prototypes/page.tsx) | [Open `/prototypes`](https://mosque.build/prototypes) | Visual project examples linked to planning tools |
| [Sources](apps/web/app/sources/page.tsx) | [Open `/sources`](https://mosque.build/sources) | Source and provenance records |
| [Trust](apps/web/app/trust/page.tsx) | [Open `/trust`](https://mosque.build/trust) | Evidence, review, and safety boundaries |
| [Contribute](apps/web/app/contribute/page.tsx) | [Open `/contribute`](https://mosque.build/contribute) | Contribution roles, standards, GitHub links, and the ummah.build community |

The complete route inventory is in [Routes and features](docs/ROUTES_AND_FEATURES.md).

## Data, privacy, and trust

- Current project drafts are stored in the user’s browser unless explicitly exported.
- Never commit real names, personal contacts, precise private addresses, project exports, credentials, or analytics dumps.
- Public country and jurisdiction names are reference data, not inferred user identity.
- Every external factual record needs provenance, an observed or verified date, rights information where relevant, confidence, and review status.
- Permit guidance remains **likely applicable / verify with authority or professional** until supported by current authority evidence.
- Every cost must carry geography, currency, date, source, maturity, confidence, and exclusions.
- Structural, fire, mechanical, electrical, plumbing, and other regulated outputs remain conceptual until qualified review.
- Religious content requires source metadata and content review. Sacred calligraphy must not be generated as decorative filler.
- Row Level Security is mandatory before project or member data is stored on a shared backend.

Read [AGENTS.md](AGENTS.md), [Security](SECURITY.md), and [Governance](GOVERNANCE.md) for mandatory project rules.

### Key data registries

- [Feature registry](data/FEATURE_REGISTRY.json) — canonical scope and maturity records.
- [Implementation waves](data/IMPLEMENTATION_WAVES.json) — prioritized delivery groups.
- [Frame registry](data/FRAME_REGISTRY.json) — visual project-example inventory.
- [External dependencies](data/EXTERNAL_DEPENDENCIES.json) — external systems and research needs.
- [Source seed manifest](data/SOURCE_SEED_MANIFEST.json) — historical-source traceability.
- [Jurisdiction guides](apps/web/data/jurisdiction-guides.json) — runtime permit and funding source records.
- [Architecture lineages](apps/web/data/architecture-lineages.json) — sourced precedent studies.
- [Pattern library](apps/web/data/pattern-library.json) — source-labelled geometric studies.
- [Marketplace candidates](apps/web/data/marketplace-candidates.json) — research candidates, not endorsements or verified availability.
- [Resource library](apps/web/data/resource-library.ts) — lifecycle guidance linked to working routes.

### Policies and project documentation

- [Contributor guide](CONTRIBUTING.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Governance](GOVERNANCE.md)
- [Security policy](SECURITY.md)
- [MIT License](LICENSE)
- [Third-party notices](THIRD_PARTY_NOTICES.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Routes and features](docs/ROUTES_AND_FEATURES.md)
- [Asset policy](docs/ASSET_POLICY.md)
- [Testing strategy](docs/03_TEST_STRATEGY.md)
- [Release gates](docs/04_RELEASE_GATES.md)
- [Next build](docs/NEXT_BUILD.md)
- [Marketing library](marketing/README.md)

## Contributing

Contributions are welcome across code, documentation, research, accessibility, design, testing, data provenance, localization, and professional review.

1. Read [CONTRIBUTING.md](CONTRIBUTING.md).
2. Search or open a [GitHub issue](https://github.com/ummahbuild/mosque.build/issues).
3. Create a focused branch.
4. Add tests and evidence appropriate to the change.
5. Run the complete verification sequence.
6. Open a [pull request](https://github.com/ummahbuild/mosque.build/pulls) using the [repository template](.github/PULL_REQUEST_TEMPLATE.md).

Good first contributions are small, testable, privacy-safe, and clearly connected to a user outcome. Work involving permits, safety, cost, religious content, or external assets may require specialist review before merge.

## License

The original software and documentation in this repository are licensed under the [MIT License](LICENSE).

Third-party material, linked sources, archived research inputs, trademarks, and assets identified in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) or [Asset policy](docs/ASSET_POLICY.md) remain subject to their own rights and are not relicensed by the MIT License.

Copyright © 2026 Ummah Build and mosque.build contributors.

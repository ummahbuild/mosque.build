# Routes and features

This is the contributor-facing map of the implemented web surface. It describes current route responsibilities without claiming that every registry item is shipped or professionally verified.

## Core project journey

| Route | User outcome | Principal implementation |
|---|---|---|
| `/` | Understand mosque.build and interact with the staged mosque preview | Landing hero, project-stage preview, product areas, trust guidance |
| `/start` | Create or resume a private project brief | Six-step guided brief, validation, local persistence |
| `/my-project` | Review connected project actions and records | Contents, action desk, integration map, controls, plan, schedule, shura, register, lifecycle, export |
| `/features` | Choose the part of the project to work on | Six lifecycle product areas and cross-project principles |

## Planning and delivery

| Route | Included areas |
|---|---|
| `/design` | Architecture priorities, templates, site/qibla/context studies, land cost, structure, climate, access, solar, energy, wudu, women’s space, integrated space planning, floor plans, openings, roofs, domes, systems, interiors, ornament, daylight, occupancy, cost control, model authoring, 3D inspection, and model quality |
| `/patterns` | Architecture lineages, precedent comparison, Islamic architecture principles, sourced pattern gallery, editable geometry, model placement, and material assemblies |
| `/permits` | Jurisdiction selection, likely permit pathways, authority sources, freshness, applicability boundaries, and verification prompts |
| `/funding` | Jurisdiction-linked charity, fundraising, reserve, and waqf starting points with legal, governance, and Shariah review boundaries |
| `/marketplace` | Needs planning, sourced candidate research, procurement controls, integrity checks, and quote comparison |
| `/construction` | Schedule, sequence, packages, delivery, integrity, document control, materials, land and regional costs, cost-saving studies, option comparison, site logs, and field sync |
| `/operations` | Handover, asset care, work orders, privacy, emergency modes, and continuity planning |

## Guidance and transparency

| Route | Purpose |
|---|---|
| `/resources` | Search and save 40 lifecycle guides and open their connected planning steps |
| `/sources` | Inspect source, date, rights, and confidence records |
| `/trust` | Understand truth, evidence, cost, permit, safety, and review boundaries |
| `/methodology` | Understand how records and recommendations are prepared |
| `/accessibility` | Review accessibility commitments and known boundaries |
| `/privacy` | Understand browser-local records and privacy behavior |
| `/terms` | Read terms for the public service |
| `/pwa-guide` | Install, offline, local-draft, update, and recovery guidance |
| `/roadmap` | Review product scope, maturity terminology, and implementation waves |
| `/open-source` | Find the repository and contribution path |
| `/contribute` | Follow the complete contribution path, standards, verification steps, GitHub links, and ummah.build invitation |
| `/waqf-library` | Explore source-labelled Quran and book stewardship records |

## Project examples

`/prototypes` is the searchable entry point for 63 visual examples. Each detail route under `/prototypes/*` connects an illustration to selectable planning capabilities and a relevant working area.

These images are reference material, not screenshots proving implementation, architectural instructions, or construction documents. See `apps/web/data/frame-registry.json`, `docs/frames`, and [Asset policy](ASSET_POLICY.md).

## Registry explorer routes

`/features/priority-100` through `/features/priority-800` expose prioritized slices of the canonical feature registry. These pages support review and discovery; an entry’s presence does not change its canonical maturity status.

## Framework-generated routes

The application also serves framework and metadata routes including `/_not-found`, `/robots.txt`, and `/sitemap.xml`.

## Shared route shell

Most public routes use:

- `SiteHeader` for responsive navigation and the current project action;
- `SiteFooter` for lifecycle, guidance, contribution, and social links;
- `ProjectJourneyNav` for the six-stage project path;
- `ProductAreaPage` for product-area hero, planning navigation, tools, capabilities, and brief CTA;
- `WorkspaceToolNavigator` for finding and stepping between long-page planning tools.

## Feature status and claims

The canonical status vocabulary is:

`concept | specified | scaffolded | executable | source_backed | beta | production_ready`

- A route can contain features at different statuses.
- A rendered component is not automatically executable.
- An executable workflow is not automatically source-backed, beta, or production-ready.
- Source-backed means the relevant external facts preserve provenance and review state; it does not mean an authority or professional approved a project.

When adding or removing routes, update this file, the sitemap where applicable, navigation if appropriate, route tests, and the root README.

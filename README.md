# mosque.build

mosque.build is an evidence-aware workspace for the full lifecycle of mosque projects: community brief, site, conceptual design, permits, budget, funding, sourcing, construction, opening, operations, endowment and preservation.

[Website](https://mosque.build) · [Contributing](CONTRIBUTING.md) · [Next build queue](docs/NEXT_BUILD.md) · [Security](SECURITY.md) · [Governance](GOVERNANCE.md)

## Current status

This is a production-base repository, not a claim that every documented capability is shipped. Feature status uses `concept | specified | scaffolded | executable | source_backed | beta | production_ready`. The canonical registry, tests and route implementations must agree before status changes.

The public application currently includes:

- a six-step private, on-device project brief and resumable project workspace;
- conceptual mosque massing and project-linked design selections;
- searchable 40-item lifecycle resource library with a private saved plan;
- persistent 24-checkpoint project lifecycle preparation board;
- sourced jurisdiction, funding and waqf starting points with explicit verification boundaries;
- pattern studies with provenance and review metadata;
- procurement comparison and local construction evidence logs;
- searchable roadmap batches, source records and visual workflow references;
- install/offline support for previously visited public pages.

## Repository map

| Path | Purpose |
|---|---|
| `apps/web` | Next.js public site and local project workflows |
| `data` | Canonical normalized registries |
| `packages` | Shared domain, UI, validation and configuration packages |
| `supabase` | Database and RLS-oriented migration drafts |
| `tests` | Repository and provenance tests |
| `scripts` | Validation and privacy/release tooling |
| `docs` | Product context, testing, release gates and contributor work queue |
| `assets/mockups` | Illustrative visual references; redistribution rights require inventory review |
| `archive/source-seeds` | Historical research inputs retained for traceability, not runtime truth |

Historical `mosqueos_seed_*` paths retain old names for traceability. New product copy and canonical code must use `mosque.build`.

## Run locally

Requirements: Node.js 22 or newer and pnpm 10.

```bash
pnpm install
pnpm test
pnpm validate
pnpm privacy:scan
pnpm web:build
pnpm web:dev
```

The local site opens at `http://localhost:3000`. Do not commit local exports, browser data, environment files or credentials.

## Trust boundaries

- Queues and discovery targets are not verified facts.
- Permit guidance remains **likely applicable / verify with authority or professional** until authority evidence exists.
- Structural, MEP, fire and design outputs are conceptual until qualified review.
- Costs require geography, currency, date, source, maturity, confidence and exclusions.
- Religious content requires source metadata and content review.
- Public jurisdiction names are reference data, not personal location data.
- Project/member data requires RLS before server persistence.

See [AGENTS.md](AGENTS.md) for repository-wide implementation rules.

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md) and choose a contributor-sized item from [docs/NEXT_BUILD.md](docs/NEXT_BUILD.md). Use the issue forms, keep pull requests focused, and run the full verification sequence.

Never commit a real person’s name, personal contact details, precise private address, private project export, credential, analytics dump or local filesystem path. Run `pnpm privacy:scan` before every pull request.

## Licensing status

An outbound open-source license has not yet been selected. The rights holder must review software, archived source material, mockups and third-party assets before publishing license terms. Until a root license is added, public visibility does not grant permission to copy, modify or redistribute this repository.

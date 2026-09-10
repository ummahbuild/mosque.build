# Contributing to mosque.build

Thank you for helping communities plan, build, operate, and preserve mosques more responsibly. Contributions are welcome when they protect people, preserve evidence, and state clearly where qualified review is still required.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Start here

Read these documents before opening a pull request:

1. [AGENTS.md](AGENTS.md) — mandatory naming, truth, safety, architecture, and testing rules.
2. [Product context](docs/00_PRODUCT_CONTEXT.md) — what mosque.build is and is not.
3. [Architecture](docs/ARCHITECTURE.md) — application boundaries and data flow.
4. [Routes and features](docs/ROUTES_AND_FEATURES.md) — current user-facing surface.
5. [Next build](docs/NEXT_BUILD.md) — prioritized work and known gaps.
6. [Security policy](SECURITY.md) and [Asset policy](docs/ASSET_POLICY.md).

## Ways to contribute

- Fix a reproducible bug or accessibility problem.
- Improve mobile, keyboard, screen-reader, offline, or low-bandwidth behavior.
- Add tests around an existing planning workflow.
- Improve user-facing guidance or contributor documentation.
- Add a sourced jurisdiction, material, architecture, or product record.
- Improve renderer-neutral domain logic or a Three.js presentation adapter.
- Review content within your professional, cultural, or religious expertise.
- Translate an agreed interface while preserving terminology and review boundaries.

Do not use a pull request to publish real project data, copied catalog content, unlicensed media, unverified regulations, unsourced prices, or generated sacred calligraphy.

## Choose the right issue

Search existing issues before opening a new one. Use the provided bug, feature, source/data, or documentation form. Report vulnerabilities privately according to [SECURITY.md](SECURITY.md), never in a public issue.

For a large change, start with a proposal issue. Large changes include new domain objects, persistence or authentication, database migrations, regulated guidance, architecture engines, major navigation or brand changes, and bulk external datasets.

## Local setup

Requirements are Node.js 22 or newer and pnpm 10.

```bash
git clone https://github.com/ummahbuild/mosque.build.git
cd mosque.build
pnpm install
pnpm web:dev
```

Create a focused branch, for example `fix/keyboard-navigation` or `docs/route-map`. Recommended prefixes are `fix/`, `feature/`, `docs/`, `test/`, and `data/`.

## Product and architecture rules

Canonical project data must be renderer-neutral. Domain records may describe geometry, materials, relationships, evidence, and review state, but must not contain a Three.js or other rendering-engine object. Renderers adapt domain records for inspection; they are not the source of truth.

Feature maturity uses these exact values:

```text
concept
specified
scaffolded
executable
source_backed
beta
production_ready
```

Do not upgrade a feature status merely because a page renders. Status changes require the corresponding behavior, evidence, tests, and review gates.

## Implementation standards

### User experience

- Start with the user outcome, not an internal implementation label.
- Reuse design tokens and components before introducing variants.
- Support keyboard navigation, visible focus, semantic HTML, and reduced motion.
- Keep primary touch targets at least 44 by 44 CSS pixels.
- Test narrow mobile, larger mobile, tablet, and desktop widths.
- Provide specific loading, empty, success, and error states.
- Avoid horizontal page overflow and inaccessible fixed or sticky controls.
- Never present an illustration or conceptual model as a buildable drawing.

### TypeScript, React, and 3D

- Prefer explicit domain types and deterministic calculations.
- Keep browser-only APIs inside client components and effects.
- Validate local-storage records and imported JSON before use.
- Clean up observers, animation frames, WebGL resources, and event listeners.
- Respect `prefers-reduced-motion` in animated or 3D interfaces.
- Memoize costly geometry and derived calculations where appropriate.

### External data and sources

Every factual external record needs the applicable source label and direct URL, observed or verified date, geography, issuing authority or author, rights or license, confidence, review state, limitations, and next verification action.

A queue entry or search result is a research target, not a verified fact. Never imply vendor approval, availability, a current price, legal applicability, scholarly consensus, or authority acceptance without supporting evidence.

### Regulated and religious content

- Permit content must say **likely applicable / verify with authority or professional** until current authority evidence supports a stronger statement.
- Structural, fire, civil, mechanical, electrical, plumbing, accessibility, and environmental outputs are conceptual until qualified review.
- Cost records require geography, currency, date, source, maturity, confidence, and exclusions.
- Religious content requires source metadata and content review.
- Do not infer sacred meaning from geometry or use sacred text as decorative filler.

### Privacy and security

Use neutral data such as “Community Mosque Project” or “Candidate A.” Never commit real personal details, precise private addresses, private project exports, credentials, environment values, production logs, hidden personal metadata, or machine-local absolute paths.

Shared project/member persistence requires Row Level Security policies and tests. Treat imports, exports, uploads, URLs, webhooks, authentication, authorization, and rich text as hostile boundaries.

## Testing requirements

Every production-bound feature must add the applicable unit, integration, persistence, RLS/security, accessibility, mobile parity, provenance, and professional-review tests.

Before opening a pull request, run:

```bash
pnpm test
pnpm validate
pnpm privacy:scan
pnpm web:build
```

For interface work also verify 360×800 and 390×844 mobile layouts, a tablet, a representative desktop, keyboard-only operation, visible focus, reduced motion, page-level overflow, browser console output, and standalone behavior when navigation or install files change.

## Assets and visual contributions

Follow [Asset policy](docs/ASSET_POLICY.md). New assets need a source, creator, date, license or permission, allowed use, modification status, and accessible alternative text where displayed. Optimize web assets and remove personal metadata before commit.

Do not assume that an image found online, a vendor photograph, a historic scan, or an AI-generated derivative can be redistributed. Link to authoritative sources when direct redistribution rights are unclear.

## Commits and pull requests

Use a concise imperative commit subject, such as `Improve keyboard navigation in the design tool`. Keep unrelated changes out of the commit.

A good pull request explains the user outcome; names changed routes, components, domain records, and datasets; states what is out of scope; links the issue; reports exact verification results; includes before/after screenshots for visual work; identifies sources and licenses; calls out migrations; preserves review boundaries; and lists limitations honestly.

Reviewers should confirm that behavior matches the claim, canonical data remains renderer-neutral, failure and stale-data states are safe, provenance remains intact, personal data is absent, tests match the risk, and documentation and feature status are accurate.

## License for contributions

By submitting a contribution, you agree that it will be licensed under the repository’s [MIT License](LICENSE). You must have the right to submit all contributed code, documentation, data, and assets. Third-party material must retain its original notices and license terms.

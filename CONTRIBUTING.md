# Contributing to mosque.build

Thank you for helping communities plan, build, operate and preserve mosques more responsibly. Contributions are welcome when they preserve the project’s evidence, safety, privacy and review boundaries.

## Before opening work

1. Read `AGENTS.md`, `docs/00_PRODUCT_CONTEXT.md`, `docs/NEXT_BUILD.md` and `SECURITY.md`.
2. Search existing issues and choose one clearly scoped outcome.
3. For large schema, architecture, regulated-content or visual-brand changes, open a proposal issue before implementation.
4. Never add personal project records, private addresses, personal contact details, credentials, copied vendor data, or assets without documented rights.

## Local setup

Requirements: Node.js 22 or newer and pnpm 10.

```bash
pnpm install
pnpm test
pnpm validate
pnpm privacy:scan
pnpm web:build
pnpm web:dev
```

## Pull-request expectations

- Keep changes focused and explain the user outcome.
- Preserve the canonical feature statuses in `AGENTS.md`.
- Add unit and integration tests; include accessibility, responsive parity, RLS/security, provenance and professional review tests when applicable.
- External facts need source, observed/verified date, rights or license where relevant, confidence and review status.
- Permit content must remain “likely applicable / verify with authority or professional” until authority evidence exists.
- Costs require geography, currency, date, source, maturity, confidence and exclusions.
- Religious material needs source metadata and content review. Do not use sacred calligraphy as decorative filler.
- Canonical project models must remain renderer-neutral.
- Run every command in the verification checklist before requesting review.

## Privacy and sample data

Use neutral placeholders such as “Community Mosque Project.” Do not commit a real person’s name, personal email, phone number, precise project address, browser export, analytics dump or local filesystem path. Public country/jurisdiction names are allowed only as cited reference data, not as inferred user identity or default sample data.

## Commit and review style

Use a short imperative commit subject. In the pull request, list changed routes, tests run, screenshots for visual work, known gaps, and any review gate that remains. Maintainers may request professional, authority, security, privacy, accessibility, religious-content or rights review before merging.

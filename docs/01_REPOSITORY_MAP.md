# Repository map

This map reflects the current repository. Historical plans may mention mobile, admin, or registry packages that are not present as active workspaces.

```text
apps/web/
  app/          Next.js pages, metadata, manifest, sitemap, and route CSS
  components/   Shared UI and interactive mosque-planning tools
  data/         Runtime jurisdiction, product, pattern, source, and architecture records
  lib/          Calculations, record schemas, safe parsing, export, and workflow integration
  public/       Service worker, icons, flags, and visual examples

packages/
  domain/       Renderer-neutral shared TypeScript domain types
  algorithms/   Reusable and historically versioned calculations
  ui/           Shared design tokens

data/           Canonical feature, frame, dependency, source, and delivery registries
supabase/       Schema, RLS, and security migration drafts
assets/         Rights-sensitive source and visual assets
archive/        Historical inputs retained for traceability, not runtime truth
docs/           Product, architecture, audit, and implementation documentation
marketing/      Community, contributor, campaign, and editorial content library
scripts/        Validation, privacy scanning, and smoke tests
tests/          Node test suites and repository contracts
.github/        Issue forms and pull-request template
```

## Ownership boundaries

- `apps/web/lib` and `packages/domain` own portable behavior and records.
- `apps/web/components` owns browser interaction and presentation adapters.
- `apps/web/data` contains data loaded by the running web application.
- root `data` contains canonical planning and registry datasets.
- `archive/source-seeds` is traceability material, not runtime truth.
- `supabase` is not evidence that public projects currently use backend persistence.
- `assets` and mirrored public media remain subject to [the asset policy](ASSET_POLICY.md).

## Canonical root datasets

| File | Purpose |
|---|---|
| `data/FEATURE_REGISTRY.json` | Feature records and maturity |
| `data/FRAME_REGISTRY.json` | Visual example inventory |
| `data/IMPLEMENTATION_WAVES.json` | Prioritized delivery groupings |
| `data/EXTERNAL_DEPENDENCIES.json` | External dependency inventory |
| `data/SOURCE_SEED_MANIFEST.json` | Historical-source traceability |

## Historical names

Historical filenames containing `mosqueos` remain for traceability. New product copy, types, routes, and canonical records must use `mosque.build`.

For route ownership, see [Routes and features](ROUTES_AND_FEATURES.md). For data flow and renderer boundaries, see [Architecture](ARCHITECTURE.md).

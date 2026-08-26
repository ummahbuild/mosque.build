# Repository Map

```text
apps/
  web/       Public website + authenticated project workspace + prototype routes
  mobile/    Expo field/donor/mobile workspace scaffold
  admin/     Platform data quality / moderation / ingestion console scaffold

packages/
  domain/          Canonical TypeScript domain types
  ui/              Shared design tokens + primitive components
  algorithms/      Executable geometry/cost/landscape/core algorithms
  frame-registry/  Visual frame contracts
  feature-registry/Feature scoring/prioritization helpers

supabase/
  migrations/      Consolidated prior SQL migrations
  README.md

assets/
  mockups/         Every available visual mockup/marketing board
  manifest.json    SHA-256, dimensions, role, route

docs/
  frames/          One markdown implementation contract per mockup
  source-context/  Editorial/product source material
  architecture/    System architecture and safety boundaries

data/
  FEATURE_REGISTRY.json
  FRAME_REGISTRY.json
  IMPLEMENTATION_WAVES.json
  EXTERNAL_DEPENDENCIES.json
  SOURCE_SEED_MANIFEST.json

archive/
  source-seeds/    v0–v27 source material preserved verbatim

scripts/
  validate.mjs
  build-manifest.mjs

tests/
  registry.test.mjs
```

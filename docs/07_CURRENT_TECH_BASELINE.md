# Current Technical Baseline — 2026-08

The root package requires **Node.js 22+** because current Supabase client support dropped Node.js 20 after its EOL.

Web baseline:
- Next.js **16.2 Active LTS security patch line** (package scaffold pins 16.2.11)
- React 19.2
- TypeScript 5+
- Supabase JS v2 family

The web renderer must remain an adapter, not a domain dependency.

Mobile baseline is intentionally a **scaffold** until a fresh native dependency resolution/build is run; native library version compatibility must be verified during implementation.

Before first real deployment:
- install dependencies from trusted registries,
- run lockfile audit,
- run framework security advisories,
- produce SBOM,
- pin exact versions in lockfile,
- test Node/server adapter in target deployment environment.

# AGENTS.md — mosque.build

## Naming
- Product is **mosque.build**, never "MosqueOS" in new user-facing or canonical code.
- Historical source folders may retain old filenames for traceability.
- Canonical domain: https://mosque.build

## Truth / safety
- Never fabricate permits, laws, prices, availability, scholarly positions, vendor status, or authority approvals.
- Queue records are targets, not verified facts.
- Every external factual record requires provenance, observed/verified date, rights/license where relevant, and confidence/review status.
- Permit UI must say `likely applicable / verify with authority or professional` until actual authority evidence exists.
- Structural/MEP/fire outputs are conceptual until reviewed by qualified professionals.
- Every cost must carry geography, currency, date, source, maturity, confidence, and exclusions.
- Religious content requires source metadata and content review; do not generate sacred calligraphy as decorative filler.

## Architecture
- Canonical domain objects must be renderer-neutral.
- No `THREE.Mesh`, Babylon entity, or Filament object in domain models.
- Use portable interchange layers: glTF/GLB for render assets, IFC for BIM exchange, GeoJSON/vector tiles for mapping.
- Node.js >=22.
- RLS is mandatory for project/member data.

## Feature statuses
`concept | specified | scaffolded | executable | source_backed | beta | production_ready`

Do not collapse these statuses into one "done" flag.

## Testing
Every production-bound feature must declare:
- unit tests
- integration tests
- RLS/security tests where relevant
- accessibility tests
- mobile/web parity tests if cross-platform
- source/provenance tests if external data
- human/professional review gates if regulated/safety/religious

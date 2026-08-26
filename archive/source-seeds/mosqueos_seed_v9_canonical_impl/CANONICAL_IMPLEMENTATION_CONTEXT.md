# mosque.build — Canonical Implementation Layer v9

This layer should be read before older seed modules.

## What changed
v9 turns the audited product specification into canonical implementation contracts:
- database boundaries
- role/capability model
- RLS expectations
- ingestion state machines
- search/ranking contract
- review/publication gates
- first launch-geography completion plan
- API envelopes
- notification and analytics dictionaries

## Engineering rule
Older v0-v7 modules remain valuable research/specification inputs, but v8 audit + v9 canonical contracts decide authority where definitions conflict.

## Supabase
Use Postgres RLS as the final application-authorization boundary. Client applications may use Supabase Auth sessions, but authorization must not depend only on hidden UI or client-side role checks.

## Geospatial
Store canonical mosque/site points in PostGIS geography/geometry. Use geographic distance functions for nearby search instead of ad-hoc degree math.

## Data completeness
Do not call queues verified datasets. The launch geography must earn publishable coverage through actual ingestion and review.

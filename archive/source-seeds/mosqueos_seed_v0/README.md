# MosqueOS Production Seed v0

This is a production-oriented data/content seed for a comprehensive mosque discovery, planning, design, funding, construction, operations, restoration and museum platform.

Generated: 2026-08-16

## Current seed counts
- 81 architecture/style/typology records
- 281 mosque component records
- 10 verified/partially verified exemplar project records
- 63 architect/designer/historian directory seeds
- 8 blueprint/CAD source records
- 4 video/media discovery records
- 124 canonical application/page records
- 16 provenance/source records

## Non-negotiable production rules

1. **Source every publishable fact.** Every factual mosque, architect, date, size, cost, building-code, product, or legal record needs provenance and a last-verified date.
2. **Separate taxonomy from facts.** Broad category seeds can be published after editorial review; project facts require source verification.
3. **Respect rights.** Do not mirror copyrighted plans, CAD files, photographs, video, product descriptions, or catalogs unless the license/permission explicitly permits it. Index metadata + outbound source links by default.
4. **No fake construction guidance.** Concept layouts are educational. Permit/construction documents require qualified local professionals.
5. **Jurisdictional truth.** Zoning, fire, accessibility, school, kitchen, noise, tax, charity, and waqf rules must resolve to official local sources.
6. **Religious-content review.** Distinguish religious requirements from cultural/historic architectural conventions; require scholar/editor review for normative religious claims.
7. **AI-video labeling.** AI/generated time-lapses are inspiration only and must never be presented as evidence of a real construction sequence.
8. **Supplier freshness.** Prices, product availability and counts are snapshots and require re-verification before display.
9. **Living-person safety/accuracy.** Architect life status and biographies need current verification before publication.
10. **Open-data first.** Prefer sources with explicit open/public reuse rights for downloadable assets.

## Recommended ingestion pipeline

discover -> fetch metadata -> normalize -> dedupe -> classify -> attach source -> rights check -> factual review -> religious review if applicable -> publish

Each record should carry:
`source_ids`, `last_verified`, `rights_status`, `review_status`, `editor_notes`, and `change_history`.

## Next production expansions

- Expand mosque exemplars to 1,000+ records across every region and century.
- Build the full architect/craftsperson authority file.
- Crawl/index Archnet and AKDN metadata within their terms.
- Build a rights-cleared blueprint library.
- Curate real construction documentaries/time-lapses separately from AI renders.
- Build jurisdiction packs country-by-country, starting with target launch geographies.
- Add supplier directories for carpet, wudu, AV/acoustics, lighting, doors/windows, tile, domes/minarets, HVAC, solar and accessibility.
- Build exact copy and validation rules for every page/state in `pages.json`.

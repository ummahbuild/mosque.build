# MosqueOS Scale Seed v1

Generated 2026-08-16.

This pass pushes the repository to the requested ingestion *capacity* while preserving the distinction between:
1. taxonomy records safe to author as product structure,
2. factual records actually verified against sources, and
3. ingestion queue slots that still require source extraction/review.

## Scale now represented

- 170 architecture/style/typology taxonomy records
- 2441 component/product-class records
- 520 construction/material technique records
- 5000 mosque factual-ingestion slots
- 550 architect/master-builder/craftsperson ingestion slots
- 1600 drawing/CAD/BIM ingestion slots
- 550 real construction/restoration-video ingestion slots
- 10000 supplier/product ingestion slots
- 120 adaptive-reuse case-study slots
- 120 funding case-study slots
- 120 waqf/endowment case-study slots
- 120 operating-budget/annual-report case-study slots
- 249 country/territory regulatory pack shells
- 5000 museum-quality component-example slots

## Production distinction

`queued_not_ingested` = a target, NOT a factual record.
No UI may count a queued record as an ingested mosque, architect, drawing, supplier, video, or case study.

## High-volume factual ingestion strategy

### Mosques
OpenStreetMap -> dedupe -> active-use verification -> Wikidata authority merge -> Archnet/AKDN/heritage enrichment.

### People
Wikidata + Archnet Authorities + AKDN + architect offices + university/museum archives.

### Drawings
Archnet drawing/CAD collections, national heritage surveys, university archives, architect offices. Rights checked per item.

### Videos
Only real-project videos from owners, architects, contractors, engineers, heritage bodies, universities, museums or reputable broadcasters are promoted to construction evidence. AI renders remain inspiration-only.

### Suppliers/products
Metadata and outbound links by default. Technical specs/prices get observed dates. Proprietary product images and descriptions are not mirrored without permission.

### Regulations
Country pack -> state/province -> county/region -> municipality -> parcel/zoning layer. Official sources only for publishable rules.

## Quality gates
- provenance present
- rights status present
- last verified date
- dedupe/authority ID
- factual review
- architectural review where relevant
- religious review for normative religious claims
- legal/professional-review warnings for permit/construction outputs

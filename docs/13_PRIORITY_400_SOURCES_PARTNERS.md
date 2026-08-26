# Priority 400 + Sources / Partner Discovery

This pass adds canonical feature candidates 301–400 and a repository-backed `/sources` gallery.

## Executable surfaces

- `/features/priority-400`: fourth deterministic, non-overlapping batch with the shared search, filter, shortlist and export workflow.
- `/sources`: searchable named-source records normalized from six historical `SOURCES.json` files.
- Partner discovery view: 204 regional/category research briefs from the global vendor ingestion backlog.
- Source status, rights note, original repository file and external URL remain visible.
- Partner discovery briefs explicitly state that they are queues, not verified partners or endorsements.
- Sitemap, footer, resources, PWA shell and route validation include both new surfaces.

## Verification contract

- Unit: at least 400 unique matching canonical candidates.
- Integration: source normalization and both static routes compile in the production build.
- Accessibility: labelled tabs, search/filter controls, native details, live result counts, keyboard operation and 44px targets.
- Mobile/web parity: gallery cards collapse to one column without horizontal page overflow.
- Source/provenance: every rendered record preserves its repository source file; named sources retain recorded status; discovery queues retain their required verification fields.
- Human/professional review: current validity, rights, jurisdiction, vendor identity, professional suitability and authority acceptance remain review gates.

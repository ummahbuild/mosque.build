# Procurement and site-update workspaces

Status: `executable` device-local workflows with `source_backed` procurement seeds.

The marketplace route now supports search, category filters, comparison of up to three observed product records, project-scope selection and JSON scope-brief export. Product records are copied from the repository's `REAL_PRODUCT_SEEDS.json` and preserve source URL, observation date, verification status and price scope where a price was observed. A listing is never presented as availability, recommendation, technical approval or a current quotation.

The construction route now supports factual site-update capture, area/type classification, reported-progress input, evidence references, accountable review status, filtering and empty states. Records remain local to the browser. They are not instructions, certified progress, inspections, payment evidence or an audit-grade server record.

Both workflows require RLS-backed project storage, permissions, server audit history and integration tests before authenticated collaboration can move beyond `scaffolded` status.

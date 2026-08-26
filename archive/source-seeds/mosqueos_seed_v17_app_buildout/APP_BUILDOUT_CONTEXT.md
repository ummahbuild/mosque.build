# mosque.build — App Buildout v17

This layer turns the prior domain systems into a coherent application surface.

## Product shells
- Public Next.js web for directory, knowledge graph, designs, vendors, products and campaigns.
- Authenticated Next.js/PWA project workspace for planning, design, cost, procurement, fundraising and construction.
- Expo mobile app optimized for field capture, inspections, scanning, nearby mosques, alerts and offline work.
- Mosque admin portal for profile, prayer schedules, programs, donations, assets and maintenance.
- Vendor portal for products, 3D models, references, RFQs, quotes, orders and shipments.
- Platform admin for claims, moderation, data ingestion, regulatory review, sources and rights.

## UX rule
The project workspace is the central operating surface. Site, 3D design, cost, marketplace, procurement, schedule, construction, fundraising and handover must all preserve the same project/scenario/object IDs.

## Mobile rule
Expo prioritizes field work and offline workflows. The professional geometry editor remains web-primary initially; mobile supports viewing, review, light edits, product placement and site capture.

## State rule
Every route has loading, empty, error, permission and offline/stale behavior. No feature is considered done from a happy-path screenshot alone.

# Landing / PWA V3 Upgrade

This pass converts the public web surface from a single marketing page into a browsable product experience.

## New public routes
- `/features` complete product map
- `/roadmap` repository-backed product context, lifecycle, status model and implementation waves
- `/start` working local-first project brief wizard
- `/design`
- `/permits`
- `/funding`
- `/marketplace`
- `/construction`
- `/operations`
- `/waqf-library`
- `/resources`
- `/methodology`
- `/trust`
- `/prototypes` existing frame library

## Landing improvements
- hero now routes into working onboarding and product map
- six primary product-area cards replace a generic feature dump
- lifecycle narrative retained
- visual mockup evidence retained without fabricated traction metrics
- adaptive reuse spotlight
- waqf / Quran / book gifting spotlight
- explicit trust boundaries
- network/institutional-memory thesis
- richer footer / internal linking

## Guided-start prototype
The `/start` wizard is intentionally local-first and unauthenticated for prototype/testing. Its six steps cover project identity, community program, site/constraints, team/funding, review and a logic-derived first action plan. It stores a versioned draft in localStorage, exposes explicit review gates, and supports structured JSON and print/PDF export. Production backend handoff remains gated on authentication, organization/project creation, privacy policy and Supabase integration.

## PWA improvements
- manifest shortcuts
- versioned shell cache
- explicit offline page
- stale cache cleanup
- navigation network-first fallback
- static asset caching

## Accessibility / SEO
- skip link
- semantic nav + routes
- crawlable dedicated product pages
- richer metadata and keywords
- expanded sitemap
- visible text labels for state; do not rely on color only

## Remaining production gates
- run dependency install and Next build in network-enabled environment
- real Lighthouse + axe audit
- keyboard/mobile QA
- authentication/project persistence
- privacy/legal pages
- analytics/cookie policy if analytics introduced
- real backend/API integration
- real external data providers and source/freshness handling
- real payments only after legal/tax/processor design

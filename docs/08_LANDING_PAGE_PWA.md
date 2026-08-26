# Landing Page + PWA Specification

## Objective
The homepage must explain mosque.build as the end-to-end system for bringing real mosques to life—not as a generic AI design toy, a donation site, or a 3D renderer.

## Canonical section order
1. Sticky navigation
2. Hero: Bring mosques to life
3. Product principles strip
4. Lifecycle explanation
5. Eight-step lifecycle
6. Full capability grid
7. Product screen gallery
8. Adaptive-reuse / scan-to-prayer-space spotlight
9. Waqf + Qurans/books/library marketplace spotlight
10. Trust/safety boundaries
11. Network-effect / institutional-memory thesis
12. FAQ
13. Project CTA
14. Full footer

## Hero message
**Bring mosques to life.**

One connected workspace to assess need, choose a site, design, permit, budget, fund, source, build, open, operate and preserve a mosque.

## Product principles
- Plan before you render.
- Verify before you claim.
- Cost before you commit.
- Maintain after you open.

## Landing-page truth rules
- Do not show invented project counts, funds raised, countries served, user ratings, or similar adoption statistics.
- Product mockup values are illustrative unless sourced from canonical demo fixtures.
- Permit information must distinguish likely applicability from authority approval.
- AI is described as assistance/coplilot behavior, never final authority.
- Waqf and donation flows require local legal, financial and scholarly review where applicable.
- Community recommendations must not infer madhhab/religious preference from ethnicity or nationality.

## PWA shell
- `manifest.webmanifest`
- SVG favicon
- 192×192 maskable icon
- 512×512 maskable icon
- 180×180 Apple touch icon
- service worker registered from root layout
- app shell cache
- standalone display mode
- theme/background colors

## SEO/AEO
- canonical `https://mosque.build`
- descriptive title and meta description
- Open Graph metadata
- Twitter card metadata
- crawlable semantic headings and plain-text product explanations
- internal links to product frame library
- no fabricated structured-data metrics

## Responsive behavior
### Desktop
Two-column hero, interactive-looking product preview, multi-column capability/product grids.

### Tablet
Hero stacks; 2-column capability grid; product previews become single-column.

### Mobile
- sticky compact nav
- one-column hero
- no overlapping floating cards
- simplified browser mockup
- 1-column lifecycle and capability cards
- accordions for FAQ
- CTA buttons become full width
- footer compresses to 2-column then can stack further if required

## Primary landing conversion paths
- Start a mosque project
- Explore product screens
- Understand how it works
- Review trust/safety boundaries
- Learn about waqf/library gifting

## Implementation files
- `apps/web/app/page.tsx`
- `apps/web/app/globals.css`
- `apps/web/app/layout.tsx`
- `apps/web/components/pwa-register.tsx`
- `apps/web/public/manifest.webmanifest`
- `apps/web/public/sw.js`
- `apps/web/public/icons/*`
- `apps/web/app/prototypes/page.tsx`

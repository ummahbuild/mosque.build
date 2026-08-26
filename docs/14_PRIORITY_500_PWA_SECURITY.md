# Priority 500, PWA Resource Center, and Bot-Abuse Baseline

## Delivered surfaces

- `/features/priority-500` exposes canonical records 401–500 through the existing search, status, dependency, shortlist, local persistence, URL-state, and export workflow.
- `/pwa-guide` explains install, offline, local-storage, update, and recovery behavior and performs a live browser capability check.
- The manifest, sitemap, footer, resources page, and service-worker shell include the new routes.
- Long card collections use deferred rendering hints to reduce initial rendering work without changing canonical content.

The 100 records are registry-backed planning candidates. They retain canonical status and must not be presented as 100 production-ready features.

## Security and crawler baseline

- Production responses add content-type, framing, referrer, permissions, opener, DNS-prefetch, and content-security-policy headers.
- `/.well-known/security.txt` publishes a security contact and canonical policy location.
- `robots.txt` keeps public discovery open while asking named model-training crawlers not to crawl the site.

`robots.txt` is advisory and is not bot prevention. It does not replace rate limiting, traffic analysis, authentication, authorization, or platform firewall controls.

## Enforceable anti-abuse rollout

The current public application has no network form submission or public mutation endpoint; the project brief is stored locally. Adding CAPTCHA or application rate limiting now would add friction without protecting a writable server surface.

Before a public POST/API endpoint is introduced:

1. Define per-route request budgets and payload-size limits.
2. Validate all input on the server and use a same-origin/CSRF strategy appropriate to the endpoint.
3. Add an accessible honeypot and minimum-completion-time signal as low-friction telemetry, never as the only defense.
4. Rate-limit by multiple signals, not IP alone, and return a clear `429` response with retry guidance.
5. Add a managed challenge only after abuse is observed; keep an accessible fallback path.
6. Test authorization and RLS for every project/member mutation.

For Vercel Firewall, create narrow path-specific rules in **log** mode first. Observe production traffic, confirm verified crawlers and real users are not affected, then publish a challenge or deny action only for demonstrated abuse patterns. Do not deploy a broad country, IP, user-agent, or all-traffic block without an incident-specific review and rollback plan.

## Verification gates

- Unit: priority selection yields at least 500 unique records.
- Integration: new routes, manifest, service worker, sitemap, and security contact compile in production.
- Accessibility: diagnostics have a labeled region, live status, keyboard-operable refresh, 44px action target, and readable responsive layouts.
- Mobile/web parity: verify 320px, 390px, and desktop widths with no horizontal document overflow.
- PWA: verify manifest linkage, production worker registration/update behavior, offline fallback, and standalone-safe-area layout.
- Security: verify production response headers and crawler output; add RLS/security tests when writable project endpoints exist.

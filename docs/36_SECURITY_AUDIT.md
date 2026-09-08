# Security audit — 2026-09-08

Status: **verified local hardening; hosted penetration testing not performed**

## Fixed in this pass

- The application dependency tree resolved vulnerable PostCSS 8.4.31 and Sharp 0.34.5 versions through Next.js. Patched direct resolutions now require PostCSS 8.5.23 and Sharp 0.35.3; `pnpm --dir apps/web audit --prod` is the release check.
- The service worker no longer stores successful navigation responses at runtime. This prevents a future authenticated page response from being retained in the shared application cache. Offline navigation still uses the explicitly pre-cached public shell or offline page.
- Project-package import now rejects prototype-related keys, more than 20 levels of nesting, more than 20,000 JSON values and individual strings above 100,000 characters, in addition to the existing 2 MB file and section allowlist boundaries.
- Production responses now add HSTS, same-origin resource policy, origin-agent clustering and a no-cross-domain-policy declaration alongside the existing CSP, framing, MIME, referrer and permissions controls.
- Database membership helper functions are no longer executable by `public` or `anon`; authenticated policy evaluation retains explicit execute grants.

## Important residual boundaries

- The CSP still permits inline script and style because the current static Next.js build emits inline framework content and widespread inline style attributes. Removing these allowances needs nonce/hash support and style refactoring; silently declaring a stricter policy would break the application.
- The Supabase files are migration drafts and were inspected statically. They were not applied to a hosted database, so policy behavior and role grants still require integration and RLS tests before cloud persistence.
- The application is currently device-local and has no authenticated server mutation routes. Authentication, uploads, payments, email and multi-user collaboration require separate threat modeling before implementation.
- Third-party links and marketplace searches leave mosque.build. Their destination content, tracking, pricing and security are outside this application's control.

## Release checks

Run dependency audit, tests, validation, privacy scan and production build. Verify response headers against a deployed HTTPS origin, test the offline shell without a network, and run RLS tests against an isolated Supabase project before treating cloud persistence as deployable.

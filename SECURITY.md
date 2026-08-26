# Security policy

## Reporting a vulnerability

Do not open a public issue for a vulnerability, exposed credential, private project record or personal data. Email `security@ummah.build` with the affected area, reproducible impact and the minimum evidence needed to investigate. Do not include third-party personal data or test against projects you do not own.

The repository currently represents an evolving product base. Security support and response-time commitments are not yet guaranteed. Maintainers should acknowledge reports privately, assess scope, rotate exposed credentials immediately, and publish a coordinated advisory when users need to act.

## Supported surface

Only the latest default branch and current production deployment are candidates for fixes. Archived source seeds are research inputs, not supported runtime code.

## Contributor requirements

- Never commit secrets or production data.
- Use publishable client keys only where explicitly designed for them.
- Enforce RLS for project/member data before server persistence.
- Treat uploads, webhooks, authentication, authorization and exports as hostile boundaries.
- Run `pnpm privacy:scan`, tests, validation and the production build before review.

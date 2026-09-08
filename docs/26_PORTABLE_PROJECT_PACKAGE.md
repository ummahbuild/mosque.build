# Portable project package and record register

Status: `executable` local persistence and `scaffolded` audit trail.

`/my-project` can export and restore the supported work saved across the public application. The package uses `mosque.build/project-package@1`; only explicitly allowlisted storage sections are accepted.

## Implemented behavior

- Detect supported saved project sections on the device.
- Export a share-safe copy by default, redacting brief contact, owner, location and freeform notes.
- Export a full local backup only after presenting a sensitive-information warning.
- Reject foreign schemas, malformed JSON, empty packages and files larger than 2 MB.
- Ignore unknown sections rather than writing arbitrary browser keys.
- Preview package date, privacy mode, warnings and included sections before restore.
- Restore only listed supported sections and reload the workspace afterward.
- Include the decision and evidence register in subsequent packages.
- Separate decisions, source evidence, professional reviews and authority records.
- Require a title, owner or accountable role, and record date.
- Preserve a reference, contextual note and user-managed review state.

## Current boundary

The package is a portable local planning record. It is not encrypted, signed, tamper-proof, synchronized, submitted to an authority or backed up to a server. A register entry reflects user input; it does not verify a source, credential, correspondence, review or authority decision.

Authenticated persistence still requires project/member RLS, integration tests, migration consent, conflict handling and a durable audit-event model.

# Construction log production hardening — 20 improvements

Status: `executable` for device-local coordination. This is not a certified site diary, contract instruction system, inspection register or payment record.

1. Added strict plain-object validation for imported and stored site updates.
2. Added bounded stable-ID validation.
3. Added real calendar-date validation.
4. Added required non-empty area, type and observation fields.
5. Added maximum lengths for every text field.
6. Added duplicate-ID rejection during safe hydration.
7. Added a 500-record hydration ceiling.
8. Added future observation-date prevention.
9. Added bounded progress validation.
10. Added whitespace normalization before saving.
11. Added evidence-required review transitions.
12. Added explicit review reopening.
13. Added full-text search across operational fields.
14. Added type, review and evidence filters.
15. Added deterministic date and progress sorting.
16. Added metrics that separate evidence from review state.
17. Added filtered JSON export with a versioned schema and boundary.
18. Added filtered CSV export with spreadsheet-formula neutralization.
19. Added progressive 20-record rendering and responsive filter controls.
20. Added actionable validation, empty, save-failure and export feedback.

## Acceptance criteria

- Invalid, oversized, duplicate or unsafe records cannot enter the working log through safe hydration.
- An update without an evidence reference cannot be marked reviewed.
- Filtering and sorting never mutate the stored order.
- Exported CSV cannot execute a cell value beginning with `=`, `+`, `-` or `@` as a formula.
- Controls remain keyboard reachable, labelled and usable at narrow widths.
- Every status remains a user-entered device-local record and never implies professional, contractual or authority approval.

## Remaining production gates

Authenticated organizations, mandatory RLS tests, immutable server-side authorship, signed review events, controlled attachments with malware scanning and retention, permissions, audit-event storage, conflict-safe server synchronization, notification preferences and qualified construction/contract review remain required before shared production use.

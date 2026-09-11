# Schedule baselines and variance — 20 production improvements

Status: `executable` for device-local project-team coordination. Records are not authenticated, signed or contractual.

1. Added a versioned schedule-baseline register.
2. Added append-only baseline capture in the user workflow.
3. Added monotonically increasing baseline sequence numbers.
4. Added required human-readable baseline labels.
5. Added required accountable-role records without personal names.
6. Added required decision or meeting evidence references.
7. Added immutable cloned task snapshots.
8. Added unique activity-ID validation before capture.
9. Added bounded activity and text validation.
10. Added a 30-baseline device-storage ceiling.
11. Added working-versus-baseline start variance.
12. Added working-versus-baseline finish variance.
13. Added overall project-finish variance.
14. Added renamed-activity detection.
15. Added added-activity detection.
16. Added removed-activity detection.
17. Added restore-as-new-working-copy behavior.
18. Reset stale progress and evidence when copying a baseline.
19. Added portable baseline-register export and project-package integration.
20. Added keyboard-accessible, responsive history and comparison controls.

## Acceptance criteria

- Capture cannot proceed without a valid working schedule, label, accountable role and evidence reference.
- Existing baseline task data is never edited by working-schedule changes or restore actions.
- Variance calculations use stable activity IDs and calendar-day differences.
- Restore creates a fresh working plan and does not present historical progress as current evidence.
- Unsafe, duplicate, oversized or malformed registers are rejected.
- The interface never describes local records as signed, approved or contractually binding.

## Remaining production gates

Server-side immutable event storage, authentication, project/member RLS, signatures, contractual calendar logic, accepted baseline workflows, time-impact analysis, controlled attachments, notifications, audit retention and qualified project-controls and contract-administration review remain required for shared production use.

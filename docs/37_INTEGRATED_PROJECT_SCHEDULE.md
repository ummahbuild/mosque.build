# Integrated project schedule

Status: `executable` device-local project-control workflow.

The `/my-project` and `/construction` workspaces now share a versioned `mosque.build/project-schedule@1` record. A deterministic eight-activity baseline connects brief, site, design, approvals, procurement, construction, commissioning and opening readiness. Users can add activities, edit dates and phases, assign accountable roles, create dependencies, record progress, attach evidence references, filter status and export portable JSON.

Dependency gates prevent downstream work from being marked active, ready for review or complete while predecessors remain incomplete. Completion additionally requires a responsible role and evidence reference. Summary metrics distinguish duration-weighted user input, overdue activities, dependency blocks, review-ready items and evidence-backed project-team completion.

The schedule is included in the allowlisted whole-project package and remains local to the browser. It is not an approved construction programme, critical-path contract analysis, payment certificate, authority approval or professional review. Authenticated collaboration, RLS, immutable revisions, calendars, resource loading, signed baselines, contract events and notifications remain future work.

Verification requirements: domain boundary tests, package allowlist test, accessibility states, mobile dense-table fallback, TypeScript, production build and browser inspection.

# Skill: Register Backend Change

## Purpose
When a developer changes code, schema, events, or workflows, update the living architecture map in the same change.

## Input
A code diff, migration, API change, workflow change, or feature request.

## Procedure
1. Classify the change into one or more domains:
   identity, directory, design, cost, sourcing, procurement, fundraising, construction, operations, governance, data.
2. Search `BACKEND_PROCESS_REGISTRY.json` for affected process IDs.
3. Add/update process `inputs`, `validation`, `writes`, `events`, `downstream`, `failures`, and `audit`.
4. Add/remove flow edges only when process dependencies truly change.
5. Regenerate Mermaid and catalog.
6. Fail the change if validator fails.
7. Add a short changelog note describing architecture impact.

## Definition of Done
A backend change is incomplete if the flow registry no longer describes actual behavior.

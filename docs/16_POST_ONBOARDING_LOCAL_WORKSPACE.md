# Post-onboarding local workspace

`/my-project` continues the six-step onboarding brief into an executable, device-local first-plan workspace.

## Implemented

- Reads the existing `mosque-build.project-draft.v2` browser record.
- Generates project-specific first actions from site, permit, team, cost, accessibility and governance gaps.
- Preserves permit, cost and professional review boundaries in task-level context.
- Saves action completion under a separately versioned local progress key.
- Provides all/open/complete filters, progress calculation, empty state and accessible 44px checklist controls.
- Handles loading and no-brief states with a route back to onboarding.
- Links back to brief editing, source research and the PWA/offline guide.
- Is available from global navigation, onboarding completion, the manifest and the offline shell.
- Uses `noindex` metadata because device-local project state is not public content.

## Current boundary

This is an executable local workflow, not cloud collaboration. It does not upload the brief, synchronize across devices, create authority records, verify sources, grant approval or replace professional review. Authenticated persistence will require project/member RLS and its required security tests before release.

## Verification gates

- No-brief route presents a clear start action.
- A saved onboarding draft populates the project summary and conditional tasks.
- Checklist state persists after reload and updates the progress indicator.
- Filters expose accurate all/open/complete states and an empty state.
- Keyboard, focus, touch targets, mobile overflow and console output are checked in browser testing.

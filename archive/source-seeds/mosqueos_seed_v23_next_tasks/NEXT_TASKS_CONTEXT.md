# mosque.build — Next Tasks Implementation v23

This pass continues the highest-value implementation work.

## Added
- 181 more features across geometry, prayer design, roofs/facades/daylight, engineering, takeoff/cost, local sourcing, construction execution and commissioning.
- Engineering assumption register.
- Detailed takeoff rule library.
- Local sourcing scoring contract.
- Detailed WBS.
- New API contracts.
- SQL draft for assumptions, packages, submittals, labor and commissioning.
- Executable geometry/prayer/takeoff/sourcing functions with tests.
- Workflow state machines.

## Critical implementation rule
Outputs generated from assumptions remain marked by assumption confidence. Engineering automation coordinates information and flags review; it does not substitute for licensed project professionals or authority approval.

## Local sourcing rule
Local alternatives can rank highly for cost, lead time, repairability and local value, but a failed hard technical gate makes them ineligible regardless of price or locality.

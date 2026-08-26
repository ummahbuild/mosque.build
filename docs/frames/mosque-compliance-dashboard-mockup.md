# Mosque Compliance Dashboard Mockup

![Source frame](../../assets/mockups/mosque_compliance_dashboard_mockup.png)

## Frame identity
- **Frame ID:** `frame_mosque-compliance-dashboard-mockup`
- **Family:** `permits-compliance`
- **Source image:** `mosque_compliance_dashboard_mockup.png`
- **Dimensions:** 1672 × 941
- **Canonical product area:** `/projects/[projectId]/permits`
- **Prototype route:** `/prototypes/mosque-compliance-dashboard-mockup`
- **Status:** `visual_reference`

## Purpose
This frame is a visual rendition of the **permits-compliance** product family. It must be implemented from canonical domain data and shared components; values/text embedded in the generated image are illustrative unless independently source-backed.

## Functional elements to preserve
- `jurisdiction-selector`
- `permit-checklist`
- `source-provenance`
- `submission-package`
- `inspection-status`

## Required implementation states
- loading
- empty / no data
- permission denied
- stale external data where applicable
- offline or sync pending on mobile-relevant workflows
- error with recovery action
- partial/incomplete configuration
- verified vs unverified external records

## Data / safety rules
- No fabricated permit, cost, vendor, demographic, religious, or safety claim may be copied directly from the mockup.
- Display provenance and observed/verified dates for external data.
- Any regulated/safety result must preserve assumptions and professional/authority review gates.
- Costs must carry currency, geography, observed date, source, maturity and confidence.
- Public donor data must respect privacy and restricted-fund rules.

## Desktop / mobile relationship
The source may show desktop, mobile, or both. The implementation must preserve information hierarchy rather than pixel-copy the mockup. Dense tables become cards/filters/drawers on narrow screens.

## Related renditions
- None automatically grouped.

## Acceptance criteria
- [ ] Route exists and uses shared navigation/project shell.
- [ ] Primary actions are keyboard accessible.
- [ ] Every status is represented by icon/text, not color alone.
- [ ] Source-backed values expose provenance.
- [ ] Mock data is clearly fixture/demo data.
- [ ] Analytics events are declared for primary actions.
- [ ] Responsive behavior has desktop + mobile test coverage.
- [ ] Visual regression reference captured after implementation.

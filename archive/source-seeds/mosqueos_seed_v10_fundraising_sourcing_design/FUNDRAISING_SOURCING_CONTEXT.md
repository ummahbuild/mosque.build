# mosque.build — Fundraising, Product Sourcing & Design Artifact Context v10

## Design
A project can maintain many saved mosque mockups/scenarios. Every render, plan, export and donor asset is tied to a specific design version and cost snapshot. Re-uploading architect/consultant files never silently overwrites canonical geometry; it creates a comparison/reconciliation workflow.

## Product sourcing
Products move from discovery -> sample -> technical review -> submittal -> RFQ -> quote -> approval -> PO -> delivery -> install -> commission -> operating asset.

## Fundraising
A campaign is tied to:
- verified recipient legal entity
- specific project/design/cost version
- specific fund/restriction
- payment/crowdfunding channels
- receipt/tax disclosure status
- public transparency settings

## U.S. legal/tax
Do not infer deductible status. A U.S. mosque may qualify as a church/religious organization under 501(c)(3), and qualifying churches/mosques may be automatically tax-exempt without filing Form 1023, but mosque.build must verify/record the organization's status before displaying tax-deductibility.

## External crowdfunding
LaunchGood is treated first as an external campaign/distribution channel with links/snapshots unless a supported partner API is available. Stripe/PayPal can be native payment adapters.

## Public trust
Published campaigns should expose approved design version, budget version, project stage, recipient identity, funding progress and update history without leaking confidential contracts or donor information.

# Backend Process Catalog

## AUTH-001 — Authenticate user
- **Domain:** identity
- **Trigger:** login/signup/deep link
- **Inputs:** email/phone/oauth credential, device/session
- **Auth/RLS:** Supabase Auth
- **Validation:** credential validity, rate limits, MFA if required
- **Writes:** auth.users session, profile bootstrap if new
- **Events:** user.authenticated
- **Downstream:** load org memberships, load entitlements, load permissions
- **Failures:** invalid credential, MFA required, provider unavailable
- **Audit:** security auth event
- **UI state:** authenticated / verification required / error

## DIR-001 — Ingest mosque candidate
- **Domain:** directory
- **Trigger:** scheduled import/manual discovery/provider event
- **Inputs:** OSM/Google/Wikidata/official source candidate
- **Auth/RLS:** server ingestion role
- **Validation:** source allowed, provider terms, minimum identity fields
- **Writes:** ingestion_candidate, provider_link
- **Events:** mosque.candidate_discovered
- **Downstream:** normalize, dedupe/entity match, review queue
- **Failures:** source timeout, invalid coordinates, duplicate
- **Audit:** ingestion job log
- **UI state:** internal candidate only

## DIR-002 — Verify and publish mosque profile
- **Domain:** directory
- **Trigger:** candidate reviewed or mosque claim
- **Inputs:** candidate, official evidence, claimed admin edits
- **Auth/RLS:** reviewer/platform editor or scoped mosque admin
- **Validation:** identity, active status, location, rights, source freshness
- **Writes:** mosques, aliases, facilities, hours, services, provider links
- **Events:** mosque.verified, mosque.published
- **Downstream:** search index, SEO page, map cache, related content links
- **Failures:** conflicting sources, unverified status, rights issue
- **Audit:** field-level provenance + change log
- **UI state:** published / limited info / disputed

## DES-001 — Create/branch mosque design scenario
- **Domain:** design
- **Trigger:** user starts mockup or duplicates public design
- **Inputs:** project, base template or public design, site/program goals
- **Auth/RLS:** project edit capability
- **Validation:** license/copy permission if based on public design, project membership
- **Writes:** design_scenario, design_version, source_design_reference
- **Events:** design.scenario_created
- **Downstream:** geometry kernel, cost estimate, permit checks, render previews
- **Failures:** unsupported import, license restriction, invalid geometry
- **Audit:** scenario lineage
- **UI state:** working design

## DES-002 — Publish reusable mosque design
- **Domain:** design
- **Trigger:** designer/owner publishes approved concept/template
- **Inputs:** approved design version, license, credits, render set, floor plans, metadata
- **Auth/RLS:** owner/designer + publish capability
- **Validation:** rights ownership, no confidential project data, structural/legal disclaimer, license selected
- **Writes:** public_design, design_license, design_files, credits, copy_count
- **Events:** design.published_public
- **Downstream:** design gallery, SEO page, copy/fork action, architect portfolio
- **Failures:** rights unclear, confidential content, missing license
- **Audit:** publication and revision history
- **UI state:** public template / reference-only / copyable

## DES-003 — Re-upload external architect revision
- **Domain:** design
- **Trigger:** DWG/DXF/IFC/PDF/image upload
- **Inputs:** external file, target project/scenario
- **Auth/RLS:** project edit + file permission
- **Validation:** file type, malware scan, rights/source metadata
- **Writes:** source_asset, import_job, design_diff
- **Events:** design.external_revision_uploaded
- **Downstream:** parse, calibrate, diff, manual reconciliation, new design version
- **Failures:** parse failure, unsupported geometry, conflict
- **Audit:** source file hash + accepted changes
- **UI state:** diff review / import failed / merged

## COST-001 — Generate versioned estimate
- **Domain:** cost
- **Trigger:** design/program/material change or manual estimate
- **Inputs:** design version, regional cost book, FX snapshot, supplier quotes, assemblies
- **Auth/RLS:** project cost capability
- **Validation:** price freshness, currency/source, unknown values flagged
- **Writes:** cost_estimate, cost_lines, fx_snapshot, confidence
- **Events:** cost.estimate_created
- **Downstream:** budget dashboard, funding gap, campaign drift check, cash flow
- **Failures:** missing price data, stale quote, unknown duty
- **Audit:** immutable estimate inputs
- **UI state:** low/base/high or P10/P50/P90

## SRC-001 — Vendor publishes product/service
- **Domain:** sourcing
- **Trigger:** vendor creates listing/feed
- **Inputs:** vendor identity, product/service, technical docs, price/quote fields, media, delivery regions
- **Auth/RLS:** verified vendor role
- **Validation:** vendor verification, category, technical fields, rights, claims moderation
- **Writes:** supplier, product, offer, technical_doc, price_snapshot
- **Events:** vendor.listing_submitted
- **Downstream:** moderation, search index, product gallery, supplier profile
- **Failures:** unverified vendor, copyright issue, misleading certification
- **Audit:** vendor + reviewer history
- **UI state:** draft / under review / published / suspended

## SRC-002 — Vendor adds real mosque reference project
- **Domain:** sourcing
- **Trigger:** vendor submits portfolio reference
- **Inputs:** mosque/project identity, scope supplied/work performed, dates, photos/docs, client contact/evidence optional
- **Auth/RLS:** verified vendor
- **Validation:** match real mosque/project, evidence review, permission for media, no false endorsement
- **Writes:** vendor_reference, mosque_vendor_link, reference_evidence
- **Events:** vendor.reference_submitted
- **Downstream:** mosque-side confirmation request, review, portfolio badge
- **Failures:** unverifiable project, client disputes claim, rights issue
- **Audit:** evidence + reviewer + mosque confirmation
- **UI state:** self-reported / verified / disputed

## PROC-001 — RFQ and quote comparison
- **Domain:** procurement
- **Trigger:** project item ready for sourcing
- **Inputs:** approved spec, shortlisted vendors, quantity, delivery location
- **Auth/RLS:** procurement role
- **Validation:** spec completeness, vendor eligibility
- **Writes:** rfq, quote, quote_normalization, award_recommendation
- **Events:** rfq.issued, quote.received
- **Downstream:** technical review, commercial compare, PO
- **Failures:** quote expired, spec deviation, currency ambiguity
- **Audit:** bid/award history
- **UI state:** open / compare / awarded

## FUND-001 — Create campaign from approved project baseline
- **Domain:** fundraising
- **Trigger:** fundraising team starts campaign
- **Inputs:** verified recipient entity, project/design version, cost baseline, fund restriction, campaign story
- **Auth/RLS:** fundraising + finance approval
- **Validation:** recipient verification, tax disclosure status, restricted fund terms, public-safe design assets
- **Writes:** campaign, campaign_version, campaign_budget, funding_channel_links
- **Events:** campaign.created
- **Downstream:** Stripe/PayPal/direct channels, LaunchGood external link, public campaign page, share kit
- **Failures:** recipient unverified, tax status unknown, budget not approved
- **Audit:** campaign version history
- **UI state:** draft / review / live

## FUND-002 — Aggregate fundraising across channels
- **Domain:** fundraising
- **Trigger:** payment webhook/manual sync/external campaign refresh
- **Inputs:** Stripe, PayPal, LaunchGood snapshot, bank transfer, M-Pesa, cash deposit, pledges, grants, in-kind
- **Auth/RLS:** server connectors + finance role
- **Validation:** idempotency, currency conversion, channel/source ID, settlement state
- **Writes:** funding_transactions, external_campaign_snapshots, pledges, grants, in_kind_contributions, reconciliation_entries
- **Events:** funding.aggregate_updated
- **Downstream:** campaign progress, fund balances, cash-flow, public transparency, 3D funded objects
- **Failures:** provider unavailable, unmatched transfer, duplicate webhook, FX missing
- **Audit:** source transaction IDs + reconciliation log
- **UI state:** gross / fees / net / pledged / received

## FUND-003 — Verify nonprofit/charity/fiscal sponsor status
- **Domain:** fundraising
- **Trigger:** recipient onboarding or periodic review
- **Inputs:** legal name, EIN/registration, IRS/charity evidence, fiscal sponsorship agreement, authorized representative
- **Auth/RLS:** finance/legal reviewer
- **Validation:** jurisdiction source, document validity, recipient bank/entity match
- **Writes:** legal_entity_status, tax_receipt_policy, verification_record
- **Events:** recipient.verification_updated
- **Downstream:** tax-deductible display gate, receipt issuer config, campaign eligibility
- **Failures:** status unclear, expired documentation, entity mismatch
- **Audit:** reviewer + evidence + date
- **UI state:** verified / pending / unverified / expired

## FUND-004 — Publish financial and construction transparency page
- **Domain:** fundraising
- **Trigger:** campaign/project goes public or scheduled update
- **Inputs:** approved budget version, fundraising aggregates, approved progress, approved photos, change-order summary
- **Auth/RLS:** project/fundraising publish capability
- **Validation:** no confidential contract/donor data, numbers reconcile, design/budget version current
- **Writes:** public_transparency_snapshot
- **Events:** transparency.snapshot_published
- **Downstream:** public campaign, donor updates, SEO/share cards
- **Failures:** reconciliation mismatch, stale project baseline, privacy conflict
- **Audit:** snapshot hash + approver
- **UI state:** public raised/spent/progress report

## BUILD-001 — Record field progress
- **Domain:** construction
- **Trigger:** daily report/photo/inspection/quantity update
- **Inputs:** activity, location, quantity, photos, crew, inspection evidence
- **Auth/RLS:** field/project role
- **Validation:** project scope, offline mutation ID, evidence
- **Writes:** daily_report, progress_update, site_media
- **Events:** progress.updated
- **Downstream:** schedule, payment review, public progress candidate, 3D status
- **Failures:** offline conflict, invalid activity, missing evidence
- **Audit:** reporter/device/time
- **UI state:** reported / verified / certified

## BUILD-002 — Certify progress/payment
- **Domain:** construction
- **Trigger:** payment application or milestone review
- **Inputs:** schedule of values, reported progress, verified quantities, inspections, changes
- **Auth/RLS:** authorized certifier/finance
- **Validation:** baseline, approved changes, evidence, retainage rules
- **Writes:** payment_application, certified_progress, payment_certificate
- **Events:** payment.certified
- **Downstream:** cash flow, funding need, contract balance, transparency summary
- **Failures:** claim exceeds evidence, unapproved change, missing inspection
- **Audit:** certifier + evidence
- **UI state:** submitted / certified / rejected

## OPS-001 — Handover installed item into asset register
- **Domain:** operations
- **Trigger:** commissioning/handover acceptance
- **Inputs:** PO/submittal/install record, manufacturer/model, serial, warranty, manual, location
- **Auth/RLS:** handover/facilities role
- **Validation:** commissioning status, asset minimum fields
- **Writes:** asset, maintenance_plan, warranty_record
- **Events:** asset.handed_over
- **Downstream:** preventive maintenance, QR tag, replacement reserve
- **Failures:** missing O&M, missing serial/model, commissioning unresolved
- **Audit:** handover package
- **UI state:** active asset

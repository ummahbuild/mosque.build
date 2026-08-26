# Release Gates

## Production-ready means all applicable gates pass

### Product
- acceptance criteria complete
- error/empty/offline/permission states designed
- analytics events declared
- support/rollback path

### Security/privacy
- RLS tests
- secrets server-side only
- data classification
- audit logging for consequential changes
- privacy/retention policy

### External data
- source + retrieved/verified date
- rights/license policy
- stale-data behavior
- confidence/review state
- no queue-as-fact

### Regulated/safety
- professional/authority review path
- warnings and assumptions visible
- no automated approval language
- evidence attachment

### Marketplace
- seller/vendor identity states
- product snapshot versioning
- inventory/price observed date
- RFQ/quote terms
- returns/refunds/fulfillment policy if transactional
- payment/tax/legal review before checkout

### AI
- model/vendor documented
- cost budget/limits
- prompt/input data classification
- structured output validation
- hallucination/fallback behavior
- source citations where factual
- human escalation
- no AI final authority for safety/legal/religious decisions

### Mobile
- offline behavior
- sync conflict behavior
- permissions
- real-device testing
- performance budget

### Accessibility
- WCAG-targeted review
- keyboard and focus
- screen-reader labels
- color-independent status

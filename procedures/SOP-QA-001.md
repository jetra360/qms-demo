---
type: SOP
doc_id: SOP-QA-001
revision: 4
effective: 2026-03-01
review_due: 2027-03-01
owner: '[[qa-engineer]]'
approver: '[[qa-manager]]'
status: active
implements: '[[POL-QUAL-001]]'
_organized: true
tags:
- inspection
- supplier-quality
---
# Incoming Goods Inspection

## Purpose

This procedure implements [[POL-QUAL-001]] by ensuring that purchased material conforms to specification before it is released to production. Revision 4 tightens the sampling plan in response to [[CAPA-2026-002]].

## Scope

All raw materials and purchased components received at the goods-in bay. Excludes services and office supplies.

## Responsibilities

- Owner: [[qa-engineer]]
- Approver: [[qa-manager]]
- Performing role: [[qa-engineer]]

## Procedure

1. On receipt, quarantine the delivery in the designated goods-in holding area.
2. Match the delivery note to the purchase order and confirm the supplier is on the approved list in [[risk-register.sheet]].
3. Draw a sample per AQL 1.0, general inspection level II, using the sampling plan in [[WI-PROD-003]].
4. Inspect dimensions, appearance and certificate of conformance against the item specification.
5. Record the outcome in [[INSP-REC-2026-011]] (or a new Record note of the same type).
6. Accept the lot and release it to stores, or reject and raise a nonconformance per [[SOP-QA-002]].
7. File the completed record so it is retrievable by `doc_id`.

## Records

- [[INSP-REC-2026-011]] — example accepted-lot inspection record.
- Training evidence: [[TRAIN-REC-2026-07]].

## References

- Policy: [[POL-QUAL-001]]
- Standard: [[iso2015-8-5-1-Control-of-production-and-provision-of-service|ISO 9001:2015 §8.5.1]], [[iso2015-8-7-Control-of-nonconforming-outputs|§8.7]]
- Related CAPA: [[CAPA-2026-002]]

## Revision history

- rev 4 — 2026-03-01 — sampling plan changed to AQL 1.0 following [[CAPA-2026-002]]; supersedes SOP-QA-014.
- rev 3 — 2025-09-12 — clarified quarantine rules.

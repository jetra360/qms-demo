---
type: SOP
doc_id: SOP-PROD-001
revision: 1
effective: 2026-12-01
review_due: 2027-06-01
owner: '[[prod-manager]]'
approver: null
status: draft
implements: '[[POL-QUAL-001]]'
_organized: true
tags:
- batch-release
---
# Batch Release

## Purpose

This procedure implements [[POL-QUAL-001]] by defining the checks required before a production batch is released to a customer.

## Scope

All production batches manufactured in-house. Contract-manufactured batches follow the supplier's release procedure plus our incoming checks in [[SOP-QA-001]].

## Responsibilities

- Owner: [[prod-manager]]
- Approver: *not yet assigned* — this draft cannot go `active` until a Role is recorded here.
- Performing role: [[prod-manager]]

## Procedure

1. Confirm all in-process records for the batch are complete and signed.
2. Verify label content against [[WI-PROD-003]].
3. Check that all nonconformances raised against the batch are closed.
4. Complete the batch release record and obtain the QA signature.
5. Release or hold the batch in the system.

## Records

- Batch release record template lives in `templates/sop-template.md`; no example record has been created yet.

## References

- Policy: [[POL-QUAL-001]]
- Standard: [[iso2015-8-6-Release-of-products-and-services|ISO 9001:2015 §8.6]]
- Work instruction: [[WI-PROD-003]]

## Revision history

- rev 1 — draft — awaiting approval.

> **Validation note:** `status: draft` with an empty `approver` is intentional. It appears in the *Unapproved drafts* saved view; a real CI gate would fail the build if this were marked `active`.

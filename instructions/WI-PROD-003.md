---
type: WorkInstruction
doc_id: WI-PROD-003
revision: 1
effective: 2026-05-01
review_due: 2027-05-01
owner: '[[prod-manager]]'
approver: '[[qa-engineer]]'
status: active
implements: '[[SOP-PROD-001]]'
_organized: true
tags:
- labelling
---
# Label Verification

## Purpose

This work instruction supports [[SOP-PROD-001]] and gives the exact checks an operator performs before a label is applied.

## Prerequisites

- Approved artwork for the current product revision.
- Calibrated label printer.
- Access to the batch record.

## Steps

1. Scan the batch ID into the label station.
2. Confirm the printed product code matches the approved artwork character for character.
3. Check the expiry date format `YYYY-MM-DD` and confirm it is legible.
4. Apply one label to the first unit of the batch and have a second operator initial the batch record.
5. Apply remaining labels; re-verify every 50 units.

## Acceptance criteria

- Zero character mismatches.
- Expiry date legible and correctly formatted.
- Two-operator initial present on the batch record.

## Records

Initials on the batch record. A rejected label is logged per [[SOP-QA-002]].

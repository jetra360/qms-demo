---
type: AuditFinding
doc_id: AUDIT-2026-Q1
severity: medium
owner: '[[qa-manager]]'
due: 2026-04-30
status: closed
related_to:
- '[[SOP-QA-002]]'
- '[[CAPA-2026-001]]'
_organized: true
tags:
- internal-audit
- audit
---
# Internal audit finding — document review controls

## Condition

During the Q1 internal audit, two procedures were found past their review date with no owner notified. One of them was [[SOP-QA-002]].

## Criteria

[[iso2015-9-2-Internal-audit|ISO 9001:2015 §9.2]] requires internal audits to verify that processes are implemented and maintained. The company procedure [[POL-QUAL-001]] requires every controlled document to carry a review date.

## Consequence

Obsolete instructions could remain in use on the shop floor, and an external auditor would see an ineffective document-control process.

## Recommended action

Introduce a computed review-due view and a build gate that fails when an active document is past its review date. Track the fix through [[CAPA-2026-001]].

## Link to CAPA

Corrective action: [[CAPA-2026-001]].

> Note: the original audit worksheet and auditor signature are held outside this demo vault. Only the finding is published here.

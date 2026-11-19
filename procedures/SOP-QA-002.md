---
type: SOP
doc_id: SOP-QA-002
revision: 3
effective: 2026-04-10
review_due: 2026-11-05
owner: '[[qa-engineer]]'
approver: '[[qa-manager]]'
status: under_review
implements: '[[POL-QUAL-001]]'
_organized: true
tags:
- nonconformance
related_to: '[[nc-lifecycle]]'
---
# Nonconformance Handling

## Purpose

This procedure implements [[POL-QUAL-001]] by defining how suspected nonconforming product is identified, isolated, evaluated and dispositioned.

## Scope

Nonconforming material found at incoming inspection, in production, or returned by a customer.

## Responsibilities

- Owner: [[qa-engineer]]
- Approver: [[qa-manager]]
- Disposition authority: [[qa-manager]]

## Procedure

1. Stop the process and segregate the affected material. Tag it with its `doc_id` and a short description.
2. Contain the material, then capture the condition in `inbox/NC-YYYY-MM-DD-NNN.md` (next sequence for the day). Write what/where/when, product and batch, immediate action and reporter in the **body**; keep `tags: [nonconformance, untriaged]` and **do not set `type`**. QA triages within one business day: set `type: AuditFinding`, `doc_id: NC-…`, `severity`, `owner`, `due`, `status: open`, `_organized: true`, swap the `untriaged` tag for `triaged`, add the `operator` tag, and move the file to `audits/`. It then appears in the *Open nonconformances* view.
3. Evaluate the impact on product already released, using [[AUDIT-2026-Q1]] as the reference format.
4. Record a disposition: rework, scrap, concession or return to supplier.
5. Where the cause is systemic, open a CAPA — see [[CAPA-2026-001]].
6. Verify the disposition was carried out and close the finding.

> **Review note:** this SOP is past its `review_due` date of 2026-11-05 and is `under_review`. It appears in the *Overdue / under review* saved view. Revision 3 is the draft currently being prepared under that review; `effective` still reflects the last approved revision (rev 2).

## Records

- [[NC-2026-11-19-001]] — worked example of a captured, triaged, still-open nonconformance.
- [[REC-NC-2026-11-19-001]] — disposition evidence for that nonconformance.
- [[AUDIT-2026-Q1]] — audit that identified weaknesses in this process (tagged `audit`).
- [[CAPA-2026-001]] — CAPA raised from the finding.
- *Open nonconformances* — saved view acting as the live register; *Inbox triage queue* shows captures awaiting triage.

## References

- Policy: [[POL-QUAL-001]]
- Standard: [[iso2015-8-7-Control-of-nonconforming-outputs|ISO 9001:2015 §8.7]]

## Revision history

- rev 3 — 2026-11-19 — *draft, under review* — step 2 now defines the nonconformance capture and triage path instead of a vague "log in Inbox" instruction.
- rev 2 — 2026-04-10 — added impact-on-released-product step.
- rev 1 — 2025-05-20 — initial issue.

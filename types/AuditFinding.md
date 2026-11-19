---
type: Type
_icon: magnifying-glass
_color: '#f59e0b'
_order: 50
_sidebar_label: Audit findings
_pinned_properties:
- doc_id
- severity
- status
_list_properties_display:
- doc_id
- severity
- status
- due
doc_id: null
severity: medium
owner: null
due: null
status: open
---

# AuditFinding

A nonconformance recorded in the QMS. Use tags to distinguish the source: `audit` (internal or external auditor), `operator` (raised under [[SOP-QA-002]] step 2), or `customer` (complaint). Write the detection date in the body.

## Condition

What was actually observed.

## Criteria

Which requirement was not met. Name the standard clause here.

## Consequence

What could go wrong if it is not fixed.

## Recommended action

What should be done, by whom, and by when.

## Link to CAPA

If the finding is being corrected, link the CAPA through `related_to`.

---
type: Note
status: template
_organized: true
---
# Nonconformance report — capture form

> Use this when creating `inbox/NC-YYYY-MM-DD-NNN.md`. Do **not** set `type`, and keep `tags: [nonconformance, untriaged]` so the capture appears in the *Inbox triage queue* view.

## Detection

- Date / time:
- Detected by:
- Where:

## Product / batch

- Product:
- Batch / lot:
- Quantity affected:

## What happened

## Immediate containment

## Reporter

- Name / role:
- Related procedure: [[SOP-QA-002]]

## Triage — QA only, leave blank at capture

- `doc_id:` NC-YYYY-MM-DD-NNN
- `type:` AuditFinding
- `source:` operator
- `severity:`
- `owner:`
- `due:`
- `status:` open
- replace the `untriaged` tag with `triaged`, set `_organized: true`, and move the file to `audits/`

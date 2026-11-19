---
type: Note
status: template
_organized: true
tags:
- ai
- sop
- prompt
---
# AI prompt — draft a controlled SOP

> Copy the block below into Tolaria's AI panel (or your MCP-connected assistant) while `templates/sop-template.md` is the active note, so the agent has the right context.

## The prompt

```text
Using templates/sop-template.md as the structure, types/SOP.md as the field contract,
procedures/SOP-QA-001.md as a house-style example, and policies/POL-QUAL-001.md as the
policy to implement, create a new note at procedures/SOP-QA-003.md.

Frontmatter — use these exact field names from README.md:
- type: SOP
- doc_id: SOP-QA-003
- revision: 1
- effective: 2026-12-01   (planned; a human will set the real approval date)
- review_due: 2027-12-01
- owner: "[[qa-engineer]]"
- approver:                (leave EMPTY — not approved)
- status: draft
- implements: "[[POL-QUAL-001]]"
- tags: [process-control]
- _organized: true

Body: follow the template headings — Purpose, Scope, Responsibilities,
Procedure (numbered steps), Records, References, Revision history.
Link related documents with wikilinks, e.g. [[SOP-QA-001]] and [[POL-QUAL-001]].
State in the Records section that no execution records exist yet for revision 1.

HARD RULE: do NOT set status: active. A human reviews, sets approver and effective,
and approves the change. Never edit verified_by or closed_on on any CAPA.
```

## What to check before accepting the draft

1. The file is at `procedures/SOP-QA-003.md` and the H1 is the human-readable title (the filename stays the `doc_id`).
2. `status: draft`, `author: ai`, `approver` empty — never `active`.
3. `implements: "[[POL-QUAL-001]]"` resolves, and the policy shows the new SOP as a backlink.
4. All headings from [[sop-template]] are present, and the procedure steps are numbered and testable.
5. Review the diff / Git history before committing — AI edits are ordinary file edits.

## Then, as a human

Set `status: under_review` and `approver: "[[qa-manager]]"`, review the diff, commit/merge, and finally set `effective` to the approval date and `status: active`. See [[sop-lifecycle]].

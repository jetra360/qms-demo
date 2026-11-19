---
type: Note
status: active
_organized: true
tags:
  - iso-9001
  - standard
description: "Structural map of ISO 9001 editions 2026 (current) and 2015 (legacy, cited by this vault)"
---
# ISO 9001 clause map

A lightweight **reference structure** so every clause mentioned in a procedure, register or policy has a stable link target. It is not a copy of the standard.

> **Copyright:** ISO 9001 is copyrighted. This vault records only clause numbers, titles and links — no normative text. Consult the purchased standard for the actual requirements.

## Editions

| Folder | Edition | Status | What is included |
|---|---|---|---|
| `2026/` | ISO 9001:2026, 6th edition | **Current** — published 2026-09-06 | Confirmed top-level clauses 1–10 only |
| `2015/` | ISO 9001:2015, 5th edition | **Withdrawn** 2026-09-16; transition until ~2029-09 | Top-level clauses 1–10 plus the subclauses this vault cites |

The 2026 revision keeps the same high-level structure but changes leadership, quality culture, ethical behaviour, risks and opportunities, planning of changes, organisational knowledge and operational control. Clause 6.3 was expanded from four to seven factors. Subclause numbering for 2026 has **not** been verified here — do not assume it matches 2015.

## The 10 top-level clauses

1. Scope
2. Normative references
3. Terms and definitions
4. Context of the organization
5. Leadership
6. Planning
7. Support
8. Operation
9. Performance evaluation
10. Improvement

Clauses 4–10 are the requirements an auditor tests against; 1–3 provide context and definitions.

## Linking convention

A clause mention in any note or sheet cell is a wikilink with the visible text preserved:

```text
[[iso2015-7-5-Documented-information|ISO 9001:2015 §7.5]]
```

- The **target** carries the edition, so 2015 and 2026 notes can coexist without ambiguous wikilinks.
- The **alias** keeps the familiar `ISO 9001:2015 §x.y` text readable in exported sheets.
- Every clause note has `tags: [iso-9001, edition-2015]` (or `edition-2026`) and a *Used by* list pointing at the documents that cite it, so backlinks show both directions.

## Cited subclauses present in `2015/`

`5.1.2`, `5.3`, `6.1`, `7.2`, `7.5`, `7.5.2`, `7.5.3`, `8.5.1`, `8.6`, `8.7`, `9.2`, `10.2`

When migrating to 2026, verify each number against the published standard before repointing a link; then change the target from `iso2015-…` to `iso2026-…` and the alias to `ISO 9001:2026 …`.

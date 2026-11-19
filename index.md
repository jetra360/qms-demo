---
type: Note
status: active
_organized: true
tags:
  - qms
  - website
description: "Homepage of the published QMS site — generated from the vault by VitePress"
---
# Tolaria QMS

A small, working Quality Management System built as a plain folder of Markdown files. This site is generated from that same vault, so a change to any note becomes a change here after the next commit and build.

> **Analogy:** the vault is the kitchen, this site is the menu. Nothing is cooked twice — every page you see is the actual working note, printed by VitePress.

## Start here

- [[00-start-here|Onboarding: the 71-page guide across three levels]]
- [[sop-lifecycle|SOP lifecycle: template to approved document]]
- [[nc-lifecycle|Nonconformance lifecycle: capture to closure]]
- [[iso-9001-map|ISO 9001 clause map: 2026 and legacy 2015]]

## Controlled documents

| Area | Entry point |
|---|---|
| Quality policy | [[POL-QUAL-001]] |
| Procedures | [[SOP-QA-001]] |
| Work instructions | [[WI-PROD-003]] |
| Records | [[TRAIN-REC-2026-07]] |
| CAPA | [[CAPA-2026-002]] |
| Registers | [[document-master.sheet]] |

## What works on this site

Every `[[wikilink]]` becomes a real link when the site is built. Search runs entirely in the browser — no server. The whole vault is published in this first version.

## Known phase-1 limitations

- Mermaid diagrams and the fenced HTML dashboard appear as **source code**, not rendered graphics.
- Spreadsheet notes show their CSV body as plain text rather than a grid.
- Frontmatter fields such as `status` and `owner` are not shown on the page; the prose still carries the meaning.

These are deliberate: they keep the first build dependency-free. Phase 2 can add rendering and publish only a curated subset of folders.

## How to update the site

1. Edit a note in Tolaria (or any editor).
2. Commit and push to `main`.
3. GitHub Actions rebuilds and republishes in about two minutes.
4. Refresh this page — the change is live. The Git history is the audit trail.

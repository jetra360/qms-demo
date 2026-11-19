---
type: Note
status: active
_organized: true
tags:
  - qms
  - website
description: "Homepage of the published QMS site — guides and work instructions generated from the vault"
---
# Tolaria QMS

A small, working Quality Management System built as a plain folder of Markdown files. This site is generated from that same vault, so a change to any guide becomes a change here after the next commit and build.

> **Analogy:** the vault is the workshop, this site is the training manual. The controlled documents stay in the workshop; only the guides and work instructions are printed here for anyone to read.

## What is on this site

This is a **curated** site. Only two folders are published:

- **Guides** — [[00-start-here|the 71-page onboarding course]], organised in three levels.
- **Instructions** — [[WI-PROD-003|work instructions]], the step-by-step checks an operator performs.

Everything else in the vault — policies, SOPs, records, audit findings, CAPAs, registers, ISO clause notes and inbox captures — stays in Tolaria and is **not published here**.

> A link you follow that ends in "(not published)" is a real vault note. Open Tolaria to read it; it is simply outside the scope of this public site.

## Start here

- [[00-start-here|Onboarding: the 71-page guide across three levels]]
- [[01-orient|Level 1 — orient: find your way around]]
- [[02-operate|Level 2 — operate: capture and triage]]
- [[03-maintain|Level 3 — maintain: documents and revisions]]
- [[WI-PROD-003|Work instruction: label verification]]

## What works on this site

Wikilinks between published guides become real links. Search runs entirely in the browser — no server. Local search only indexes the pages on this site, so it will not surface a controlled document that lives in Tolaria.

## Helpful to know

- Mermaid diagrams and the fenced HTML dashboard appear as **source code**, not rendered graphics.
- Spreadsheet notes show their CSV body as plain text rather than a grid.
- Frontmatter fields such as `status` and `owner` are not shown on the page; the prose still carries the meaning.

These are deliberate: they keep the build dependency-free.

## How to update the site

1. Edit a note in Tolaria (or any editor).
2. Commit and push to `main`.
3. GitHub Actions rebuilds and republishes in about two minutes.
4. Refresh this page — the change is live. The Git history is the audit trail.

To publish a different folder, change `PUBLISHED_FOLDERS` in `site/.vitepress/publish-scope.mjs` — the build exclusions, sidebar and link handling all follow from that one setting.

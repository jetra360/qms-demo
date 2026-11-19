---
type: Note
status: active
_organized: true
tags:
  - reference
  - lessons-learned
  - build
description: "Decisions, pitfalls and fixes from building the QMS vault and its published site"
---
# Lessons learned — QMS vault and site build

A reference for the next person or agent who extends this vault. Rule of thumb: **if you repeat a mistake recorded here, add it to this note.**

> **Analogy:** this is the incident log for the workshop. The machine still runs, but the note explains why the safety guard is where it is.

## 1. Tolaria's real boundaries

| We first assumed | Tolaria actually does |
|---|---|
| Folders define document types | `type:` frontmatter defines the type. A Type is a note with `type: Type`; its H1 is the type name. |
| Registers are `.sheet` files | Sheet notes are `.md` with `_display: sheet`, a CSV-like body and `_sheet` presentation metadata. |
| Rich frontmatter is free | Only **three** fields drive every saved view: `type`, `status`, `tags`. |
| Inbox is just another folder | Untyped captures with no `_organized` flag stay in the Inbox. |
| Double-bracket links are file paths | They resolve by **filename stem or H1 title**, never by path. A link targeting a folder path dangles. |
| Moving a file changes its type | It does not. Type comes from frontmatter only. |

**Rule:** prefer Types and relationships over folders. Keep folders for humans and for a future publish filter.

## 2. Frontmatter: less is more

- Started with ~64 distinct keys; simplified to 38 (18 contract fields + Type-doc UI, sheet internals and dashboard metrics).
- Keep a field only if it drives a filter, a view, a rule or accountability.
- Move prose (root cause, corrective action, evidence, capture details) into the body.
- Use **one** relationship field, `related_to`. It is a Tolaria default, so inverse backlinks are computed; custom relationship names are not.
- Keep `doc_id` (identity = filename) and `revision` (version of the same document).

> Frontmatter is the **library index card**; the body is the book. Put search terms on the card, the story in the book.

## 3. Identity versus version

- `POL-QUAL-001` and `POL-QUAL-002` are two **different policies**, not two versions.
- A new approved edition of `POL-QUAL-001` keeps the filename and increments `revision`.
- The body *Revision history* is the human story; Git commits and optional tags are the machine record.
- `registers/document-master.sheet.md` is an **index**, not the source of truth. It already drifted once (sheet said rev 2 while the file said rev 3); `scripts/validate-vault.py` now catches that.

## 4. Website build — the expensive lessons

### 4.1 VitePress does not understand Tolaria links
- Solution: `site/.vitepress/wikilinks.mjs`, a small markdown-it plugin that builds a filename→route map and rewrites double-bracket links with aliases into real site links. It leaves VitePress's own TOC token alone.
- Verify a build by inspecting generated HTML for `/qms-demo/...html` links.

### 4.2 Never alias the Vue package to a file — this broke every interactive control
- **Symptom:** sidebar groups would not expand, links did nothing, theme switch did nothing.
- **Console:** `TypeError: Cannot read properties of undefined (reading 'shallowRef')`. Build also warned `Circular chunk: framework -> theme -> framework`.
- **Cause:** `srcDir` points at the vault, outside `site/`, so bare imports could not be resolved from the notes. Aliasing `vue` to a specific file created **two Vue instances**; the page rendered statically but hydration died.
- **Fix:** `site/.vitepress/prepare-modules.mjs` creates a `node_modules → site/node_modules` symlink at the vault root, so standard resolution finds a single Vue instance. It runs via `docs:prepare` inside `docs:dev` and `docs:build`.
- `vite.resolve.modules` did **not** fix the subpath import `vue/server-renderer`; the symlink did.

> Two delivery drivers with different keys to the same door: both arrive, neither can open it. One key, one driver.

### 4.3 Markdown that VitePress or Vue consumes
- Literal double-curly-brace expressions in prose are treated as Vue interpolation and fail the build. Say "double-curly-brace expressions" in documentation instead.
- Placeholder text such as FIELD or NAME written between angle brackets inside backticks becomes an HTML element and causes "Element is missing end tag". Use plain uppercase words.
- Mermaid blocks and the fenced HTML dashboard render as **source code** in phase 1 — accepted and documented on `index.md`.
- Sheet notes render their CSV body as plain text — also accepted.

### 4.4 Base, sidebar, CI
- `base: '/qms-demo/'` must match the GitHub repository name and the Pages URL.
- `site/.vitepress/build-sidebar.mjs` generates `sidebar.json` from folders (18 groups, 148 pages). Never hand-edit the generated file.
- GitHub Pages: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
- CI uses `npm ci` (lock file committed), `npm run docs:build`, then uploads `site/.vitepress/dist`.
- Never commit build output or installed dependencies.

## 5. Git and authentication

- GitHub rejects account passwords for Git operations. Use a personal access token **as** the password, or SSH keys.
- This vault uses SSH: the existing local `~/.ssh/id_ed25519.pub` was registered on the GitHub account and `origin` points at the SSH URL. Pushes need no password.
- The Git repository root must be the **vault folder**, so Tolaria's Git features see it.
- Proof loop: edit a note → commit → push → GitHub Actions → refresh → change is live.

## 6. Human-only gates

- AI and MCP may write `draft` notes only. Only a human sets `status: active`, `approver`, `effective`, and CAPA closure fields.
- `AGENTS.md` carries these rules; `chore(ai):` commit prefixes give machine-action provenance.
- A rule enforced by a machine is an **effective** control; a rule enforced by memory is a finding waiting to happen.

## 7. Process habits that paid off

- Ask about contradictions before building. Example: ISO 9001:2015 was withdrawn in 2026 and replaced by ISO 9001:2026 — the vault keeps both editions with explicit legacy labels.
- Validate after every phase: `python3 scripts/validate-vault.py` for notes and `npm run docs:build` for the site.
- One focused diagram, one analogy and a Why/When/Who/Where table per guide page made the onboarding set usable; forward links and back links keep it navigable.
- Small committed steps beat one large change — each phase had a clean commit and an easy rollback point.

## 8. Checklist for the next build

1. Check Tolaria's docs for the real storage contract before inventing a format.
2. Decide the field contract first; keep only filter/rule/accountability fields.
3. Decide identity versus version rules before creating document IDs.
4. Put every clause or standard reference behind a wikilink from day one.
5. Build the validator early; run it before every commit.
6. For the site: use a wikilink plugin, generate the sidebar, and **never alias Vue**.
7. Test interactivity in a real browser (sidebar toggle and theme switch), not just a successful build.
8. Remember: a public repo publishes the whole vault — isolate a curated folder before sharing widely.

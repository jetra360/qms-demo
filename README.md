---
type: Note
status: active
_organized: true
tags:
  - qms
  - start-here
---
# QMS demo vault — start here

A small, fully working **Quality Management System** built as a plain Tolaria vault. Every file is Markdown with YAML frontmatter; there is no database and no proprietary format. Open this folder as a vault in [Tolaria](https://tolaria.md/) and the whole graph is live.

## Why this structure exists

A QMS is a **graph of controlled documents**, not a pile of files. Tolaria's three primitives map directly onto it:

| Tolaria primitive | QMS job in this vault |
|---|---|
| `type:` frontmatter + Type documents | Document classes with mandatory fields and new-note templates |
| Wikilinks in frontmatter and body | Traceability: policy → SOP → record → CAPA → finding |
| Saved views in `views/` | Live "document control" dashboards — computed, never maintained by hand |

Folders are kept because they mirror the source sketch and make a future static-site publish trivial. **Tolaria does not read type from folder** — every note carries its own `type:` value.

## Open it

1. In Tolaria: **Add vault → Open existing folder** → select `qms-vault/`.
2. Optionally run **Add Remote** to put the vault under Git (this is what creates the audit trail in a real QMS).
3. Open the **Views** panel:
   - Document control: `Controlled documents`, `Overdue / under review`, `Open CAPAs`, `Unapproved drafts`, `All quality documents`
   - Operations: `Inbox triage queue`, `Open nonconformances`, `All nonconformances`
   - Reusable forms: `Templates`
   - Learning: `Guides & onboarding` (71 pages across three levels)
4. Open `dashboards/QMS overview` for the HTML dashboard, `dashboards/nc-lifecycle` for the nonconformance lifecycle, or `dashboards/sop-lifecycle` for the SOP draft-to-approval lifecycle.
5. **New to the QMS? Start with [[00-start-here]]** — the top-level operating map. Each of its seven pathway pages has one flowchart, an analogy, and links to go deeper or come back.
6. **Extending this build? Read [[lessons-learned]] first** — the decisions, pitfalls and fixes from the vault and website build, including the VitePress/Vue hydration trap and the field contract.

## Starting from a template

The **`Templates`** view lists both the copy-paste forms in `templates/` and the Type documents in `types/` (which are Tolaria's native new-note templates). Three ways to start, in order of preference:

1. **Native Type path** — create a new note of a Type (e.g. SOP or CAPA). Tolaria pre-fills the frontmatter defaults and body scaffold defined in that Type document. Set the H1, then fill in the fields.
2. **Raw copy of a standalone form** — open e.g. `templates/nonconformance-report.md`, press `Cmd+\` / `Ctrl+\` for raw mode, select all and copy; press `Cmd+N` / `Ctrl+N` for a new note and paste. This preserves the frontmatter. Rename the file to the required convention (`NC-YYYY-MM-DD-NNN.md`), set the H1 and fields, then save.
3. **Filesystem duplicate** — copy the template's `.md` file in your file manager, rename it, then open it in Tolaria. Because files are the source of truth, Tolaria picks it up on reload.

> The official Tolaria docs do not list a dedicated "Duplicate note" command, so option 2 or 3 is the reliable way to copy a standalone template *including its frontmatter*. The command palette (`Cmd+K` / `Ctrl+K`) is the place to check for newer commands.

For the NC capture form specifically, follow the convention in [[SOP-QA-002]] step 2: no `type`, `tags: [nonconformance, untriaged]`, and the fields listed in the diagram at `dashboards/nc-lifecycle`.

## Drafting an SOP with AI

The visual lifecycle is in [[sop-lifecycle]]. The primary path is the **in-app AI panel**:

1. **Configure the target** — Settings → AI → choose a **coding agent** (Claude Code, Codex, OpenCode, etc.) and permission mode **Vault Safe** (file/search/edit tools only). A *direct model* target (Ollama, OpenAI, Gemini, OpenRouter) is chat-only: it can advise but cannot write files.
2. **Set the context** — open the **Templates** view and open `templates/sop-template.md` so the agent sees the form. Optionally also open the policy the SOP will implement.
3. **Prompt** — open the AI panel with `Cmd+Shift+L` / `Ctrl+Shift+L`, or press `Cmd+K` then a space for an inline prompt. Paste [[ai-sop-draft-prompt]] and adapt the placeholders.
4. **Review the result** — the agent writes an ordinary file, so inspect the diff and Git history before committing. Check the Properties panel (`Cmd+Shift+I`) for `status: draft`, `author: ai`, empty `approver`, and a working `implements` wikilink.
5. **Human promotion** — set `status: under_review` and `approver: "[[qa-manager]]"`, review the diff, commit/merge, then set `effective` to the approval date and `status: active`.
6. **Verify** — the SOP leaves *Unapproved drafts*, appears in *All quality documents*, and shows as a backlink on `POL-QUAL-001`.

**Alternative — external MCP:** Settings → AI → **External MCP Setup** writes Tolaria's MCP entry into Claude Code, Cursor, Antigravity CLI or a generic config. The server can search/read notes, create notes, append to a note and update a complete note (with an optional modification-time guard); Tolaria refreshes automatically after each write. Use the same prompt, then follow steps 4–6 above.

> **Non-negotiable:** AI/MCP may only produce `status: draft`. Only a human sets `status: active`, `approver`, `effective` and CAPA closure fields. `AGENTS.md` carries this rule; Git provides the diff and rollback that make the boundary auditable.

## Folder map

```text
qms-vault/
├── types/           Type documents (the schema + new-note templates)
├── policies/        POL-*        top-level commitments
├── procedures/      SOP-*        controlled procedures
├── instructions/    WI-*         task-level work instructions
├── records/         *-REC-*      proof that a procedure was followed
├── audits/          AUDIT-*      internal audit findings
├── capa/            CAPA-*       corrective & preventive actions
├── registers/       *.sheet.md   spreadsheets (document master, risk, RACI)
├── iso-9001/        2026/ + 2015/ clause map; every clause mention links here
├── guides/          top-level onboarding: hub + one page per pathway
├── scripts/         validate-vault.py — document-control checks
├── inbox/           captured, untriaged items (no type yet)
├── templates/       copy-paste templates for use outside Tolaria
├── people/          Person notes
├── roles/           Role notes (owner / approver / verifier targets)
├── dashboards/      HTML dashboard + Mermaid lifecycle diagrams
├── views/           saved custom views (.yml)
└── attachments/     images and other non-Markdown files
```

## The field contract (canonical names)

The contract is deliberately small: only fields that drive a filter, a view or accountability live in YAML. Everything else is written in the note body, where it is still readable and searchable. Aliases from the original source documents are noted so you can reconcile them.

| Field | Applies to | Meaning |
|---|---|---|
| `type` | all notes | The only grouping mechanism; Title Case to match Type document H1 headings |
| `status` | all notes | `active`, `draft`, `under_review`, `open`, `closed`, `obsolete`, `template` |
| `tags` | all notes | Lateral filtering; `operator` / `audit` replace the old `source` field |
| `doc_id` | controlled docs, records, findings, registers | Identifier (also the filename); alias in old docs: `id` |
| `revision` | Policy / SOP / WI | Integer revision number |
| `effective` | Policy / SOP / WI | Date the document became effective (alias: `effective_date`) |
| `review_due` | Policy / SOP / WI | Drives the *Overdue / under review* view |
| `due` | CAPA / AuditFinding | Deadline; drives the open-CAPA and open-NC view sorts |
| `owner` | documents, registers | Wikilink to the accountable Person or Role |
| `approver` | documents | Wikilink to a Role; empty means not approved |
| `severity` | CAPA / AuditFinding | `high` / `medium` / `low` |
| `captured_on` | Inbox captures | Sort key for the triage queue |
| `performed_on` | Records | When the evidence was created |
| `verified_by`, `closed_on` | CAPA | Human attestation; never set by an agent |
| `implements` | SOP / WI | Wikilink to the Policy being implemented |
| `related_to` | wherever linked | The single relationship field; gives free inverse backlinks |

**Moved to the body** (still present, just not in YAML): `standard_ref` (alias `standard`), `process_area`, `supersedes`, `root_cause`, `corrective_action`, `evidence`, `result`, `expires`, `performed_by`, and all capture details (reporter, product, batch, containment). `related_sop`, `related_policy`, `related_finding`, `related_capa` and `has` were folded into `related_to`.

## ISO 9001 clause references

Every clause mention in this vault is a wikilink into `iso-9001/`, so a register cell like `ISO 9001:2015 §7.5` is also a clickable reference: `[[iso2015-7-5-Documented-information|ISO 9001:2015 §7.5]]`.

`iso-9001/2015/` holds the top-level clauses plus the subclauses this vault cites; `iso-9001/2026/` holds the confirmed top-level structure of the current edition. ISO 9001:2015 was withdrawn on 2026-09-16 (three-year transition), so 2015 links are marked legacy. The clause notes contain numbers and titles only — not the copyrighted normative text. See `iso-9001/README.md` for the full map and linking convention.

## Identity and versioning

Two different things, deliberately kept separate:

- **Identity = `doc_id`.** `POL-QUAL-001` and `POL-QUAL-002` are two *different policies*. The ID is permanent: never reuse it, never rename the file. New IDs are allocated by looking at `registers/document-master.sheet.md` and taking the next free number in the series. That sheet is an **index**, not the source of truth.
- **Version = `revision`.** A new approved edition of `POL-QUAL-001` stays in the same file and becomes `revision: 3`. Set `effective` to the approval date and add a line to the *Revision history* section in the body. Git holds the actual diff forever; optionally tag the approved state, e.g. `git tag POL-QUAL-001-r3`.

The vault cannot auto-increment or enforce workflow states, so a local guard checks the invariants:

```sh
python3 scripts/validate-vault.py
```

It fails on: duplicate `doc_id`, filename ≠ `doc_id`, an `active` document without `approver`/`effective`, a revision mismatch between the master sheet and the file, duplicate sheet IDs, or broken wikilinks. It warns on an `active` document whose `review_due` has passed. Run it before committing, or wire it into CI later. The *Controlled documents* view is the human-readable control-tower list, sorted by `doc_id`.

## Nonconformance flow (step 2 of SOP-QA-002)

The operational side is **one note per incident**, in two stages:

1. **Capture** — an operator creates `inbox/NC-YYYY-MM-DD-NNN.md` with `captured_on` and `tags: [nonconformance, untriaged]`; the reporter, product, batch and containment are written in the body. No `type` and no `_organized`, so it stays in the Inbox and appears in the *Inbox triage queue* view. Use `templates/nonconformance-report.md` as the form.
2. **Triage** — QA sets `type: AuditFinding`, `doc_id: NC-…`, `severity`, `owner`, `due`, `status: open` and `_organized: true`, swaps the `untriaged` tag for `triaged`, adds the `operator` tag, and moves the file to `audits/`. It now appears in *Open nonconformances* and *All nonconformances*.

Assessment and disposition (steps 3–4) go in the **same note**; a `Record` note holds the signed evidence. A CAPA is linked via `related_to` (step 5). Closure (step 6) sets `status: closed`, `verified_by` and `closed_on` — **human only**.

Worked examples: [[NC-2026-11-19-002]] (captured), [[NC-2026-11-19-001]] (triaged), [[REC-NC-2026-11-19-001]] (disposition).

## The worked traceability chain

Open these in order to see the graph close:

1. `[[POL-QUAL-001]]` — Quality Policy (the commitment)
2. `[[SOP-QA-001]]` — Incoming Goods Inspection (implements the policy)
3. `[[INSP-REC-2026-011]]` — inspection record (proof it was done)
4. `[[CAPA-2026-002]]` — supplier defect CAPA (a problem found in practice)
5. `[[AUDIT-2026-Q1]]` — internal audit finding that raised the CAPA
6. `[[TRAIN-REC-2026-07]]` — training record closing the loop back to the SOP

Backlinks make this bidirectional: opening `POL-QUAL-001` shows everything downstream of it.

## Demo data

The clock for this demo is **2026-11-19**. A few records are deliberately imperfect so the views have something to find:

- `SOP-QA-002` is past its review date and `status: under_review` → appears in *Overdue / under review*.
- `SOP-PROD-001` is `status: draft` with no `approver` → appears in *Unapproved drafts*.
- `CAPA-2026-002` is `open` → appears in *Open CAPAs*.
- Three items in `inbox/` are untyped captures → visible in Tolaria's Inbox and in the *Inbox triage queue* view until triaged.
- `[[NC-2026-11-19-002]]` is an untriaged nonconformance; `[[NC-2026-11-19-001]]` shows the same flow after triage.

## Rules for AI agents

See `AGENTS.md`. In short: an agent may create `draft` notes and capture Inbox items; **only a human may set `status: active`**.

## Publishing the site (curated, configured)

The vault stays complete; the website publishes **only the guides**. The kitchen is still the vault; the menu printed from it contains just the training material.

```text
qms-vault/
├── index.md                        ← site homepage (" / ")
├── site/package.json               ← vitepress + docs:dev / docs:build
├── site/.vitepress/config.mts       ← base, srcDir '..', nav, derived srcExclude, search, wikilink plugin
├── site/.vitepress/publish-scope.mjs ← THE publish allowlist (edit this to change scope)
├── site/.vitepress/wikilinks.mjs    ← converts Tolaria links; marks unpublished targets
├── site/.vitepress/build-sidebar.mjs← generates a nested, collapsible guides sidebar
├── site/.vitepress/mermaid.mjs     ← turns ```mermaid fences into renderable containers
├── site/.vitepress/sidebar.json    ← generated (do not hand-edit)
├── site/.vitepress/theme/          ← Nord styling + "not published" + Mermaid renderer
└── .github/workflows/deploy.yml    ← GitHub Actions → GitHub Pages
```

### What is published

`site/.vitepress/publish-scope.mjs` is the single source of truth:

```js
PUBLISHED_FOLDERS = ['guides']
PUBLISHED_ROOT_FILES = ['index.md']
```

- `srcExclude` in `config.mts` is **derived** from that list, so everything else is never rendered or indexed.
- `build-sidebar.mjs` uses the same module — the sidebar shows only *Guides*, nested as chapters → sections → details.
- `wikilinks.mjs` uses it too: a link to a real vault note that is not published renders as a dimmed **"(not published)"** marker, never a dead 404. Guides link to about 40 such notes (policies, registers, ISO clauses, records) — those live in Tolaria, not on this site.
- To change the public scope, edit **only** `PUBLISHED_FOLDERS`. Do not hand-edit `sidebar.json` or the exclusion list.

### Reader experience

- Each chapter page (`0N-*.md`) opens with a Nord banner: chapter number, a small generated Mermaid map of its sections, and a child-page list.
- A previous / next chapter footer at the bottom of each chapter page lets readers walk 01 → 07 without returning to the sidebar.
- **Expand all / Collapse all** controls sit above the sidebar tree.
- The site remembers the last guide you opened; the homepage shows a *Continue where you left off* link to it. This is a convenience link, not a forced redirect.
- A **Hide navigation / Show navigation** control at the left of the top bar (before the search box) collapses the left sidebar and gives the article the full width. The choice is remembered.
- Mermaid diagrams render as SVGs in both themes. Empty grey cards are never shown: a container is styled only once its diagram is ready. **Every** diagram has an **Expand overview** button that opens a full-screen, zoomable view titled from its nearest heading. Very large diagrams also use a `mermaid wide` fence so they scroll horizontally with readable node sizes.

Local preview and build:

```sh
cd qms-vault/site
npm install          # once
npm run docs:dev     # http://localhost:5173/qms-demo/
npm run docs:build   # output: site/.vitepress/dist/
```

`npm install` has already been run and `package-lock.json` is committed. `dist/` and `node_modules/` are git-ignored — never commit build output. `docs:prepare` recreates the root `node_modules` symlink and regenerates the sidebar; never alias Vue in `config.mts`.

To go live:

1. Push this repo to GitHub as **`qms-demo`** — the name must match `base: '/qms-demo/'` in `config.mts`.
2. In GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Push to `main`. The workflow builds and deploys in about two minutes.
4. Proof: change a guide → commit → push → refresh the site → the new value appears. That is the whole point of the design.

**Accepted limitations:** Mermaid diagrams and the fenced HTML dashboard appear as source code; sheet notes show raw CSV. This keeps the build dependency-free.

## What is deliberately not published

`instructions/`, `policies/`, `procedures/`, `records/`, `audits/`, `capa/`, `registers/`, `inbox/`, `templates/`, `dashboards/`, `people/`, `roles/`, `iso-9001/` and `types/` remain in the vault and in Git. They are separated from the site by the build exclusion, not by copying files — so there is no second copy to drift out of sync. A future change of mind is a one-line edit to `PUBLISHED_FOLDERS`, followed by `npm run docs:build` and a browser check.

`AGENTS.md` (MCP) is still a design document, not scaffolded.

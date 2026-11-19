---
type: Note
status: active
_organized: true
tags:
  - qms
  - start-here
---
# QMS_demo vault — start here

This vault is the **guide half** of a two-site QMS demo. It contains the 71 onboarding pages and the site homepage; the controlled documents (policies, SOPs, records, audits, CAPAs, registers, ISO clauses, templates, people and roles) live in the independent **`qms-controls`** repository.

> **Analogy:** this vault is the training manual; `qms-controls` is the filing cabinet. Both are generated from plain Markdown with YAML frontmatter, but each has its own repository, configuration and website. Open this folder in [Tolaria](https://tolaria.md/).

## Repository layout

```text
qms-vault/            ← git root
├── vault/            ← the folder to open in Tolaria
│   ├── index.md      site homepage
│   ├── guides/       71 onboarding pages
│   ├── README.md     this file
│   ├── AGENTS.md     authoring rules for this half
│   ├── lessons-learned.md
│   └── DEVELOPMENT.md
├── site/             VitePress build (outside the vault)
├── scripts/          validators
└── .github/          deploy workflow
```

Website code stays outside `vault/`, so Tolaria's Inbox shows only real notes. Never move `site/` into the vault.

## Start reading

1. Open Tolaria's **Views** panel → *Guides & onboarding* (`views/guides.yml`) — one live view listing all 71 guides, sorted by title. It is the only saved view here; the document-control views live in `qms-controls` alongside the documents they filter.
2. **[[00-start-here]]** — the top-level operating map. Its seven pathways (Orient, Operate, Maintain, Monitor, Improve, Align, Govern) each have one flowchart, an analogy, and links deeper.
3. Chapter pages such as [[01-orient]] are the main entries; sections like `01.2` and details like `02.2.1` sit underneath.
4. **Extending the build? Read [[lessons-learned]] and [[DEVELOPMENT]] first.** They cover the field contract, the Vue hydration trap, the two-site split, the build pipeline and the deploy steps.

## The other half

Controlled documents are not in this vault. Links such as [[POL-QUAL-001]] or [[CAPA-2026-002]] open the **QMS_controls** website in a new tab (marked with "↗"). A link marked "(not published)" points to a note that exists in the other site's vault but is outside this site's scope.

| | QMS_demo (this repo) | QMS_controls |
|---|---|---|
| Repo | `jetra360/qms-demo` | `jetra360/qms-controls` |
| Site | `jetra360.github.io/qms-demo` | `jetra360.github.io/qms-controls` |
| Content | `guides/` | every other folder |

## Website commands

```sh
cd qms-vault/site
npm ci
npm run docs:dev     # local preview
npm run docs:build   # production build
```

From the repo root: `python3 scripts/validate-vault.py` and `python3 scripts/validate-wikilinks.py`.

Push to `main` → GitHub Actions → GitHub Pages. The site is static and stays online when this computer is off.

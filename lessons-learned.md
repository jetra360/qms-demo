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
- `site/.vitepress/build-sidebar.mjs` generates `sidebar.json`. Never hand-edit the generated file. It now generates **1 group, 71 pages** from the published scope (it was 18 groups, 148 pages when the whole vault was published).
- GitHub Pages: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
- CI uses `npm ci` (lock file committed), `npm run docs:build`, then uploads `site/.vitepress/dist`.
- Never commit build output or installed dependencies.

### 4.5 Curated publishing — publish only guides

The whole-vault site was replaced by a curated site containing only `guides/` (plus `index.md` as the homepage). Work instructions were first included, then removed on request; the note `instructions/WI-PROD-003.md` is untouched in the vault and is simply excluded from the build.

- **One allowlist, three consumers.** `site/.vitepress/publish-scope.mjs` exports `PUBLISHED_FOLDERS`, `PUBLISHED_ROOT_FILES`, `isPublished()` and `buildExcludes()`. `config.mts`, `build-sidebar.mjs` and `wikilinks.mjs` all import it. If scope is scattered across files, they drift. Today `PUBLISHED_FOLDERS = ['guides']`.
- **Exclude, don't copy.** VitePress `srcExclude` takes glob patterns passed to `glob`'s `ignore`. `buildExcludes()` derives them from the folders that actually exist, so a new folder is excluded by default — fail closed, not open. `srcExclude` is `string[]` in VitePress 1.6.4. Copying into a `published/` folder would create a second copy that can drift.
- **The homepage still builds.** `index.md` is in `PUBLISHED_ROOT_FILES`; it is reached from the nav, not the sidebar.
- **Links to unpublished notes are the subtle part.** The 71 guides contain ~40 "go deeper" wikilinks to policies, registers, ISO clauses, records, work instructions and people. `buildNoteMap()` now returns two structures: `published` (stem/route → route for published files) and `all` (every stem in the vault). `wikilinkPlugin()` checks `published` first for a real link, then `all` to decide between "exists but not published" and "genuinely missing".
- **Render unpublished targets as a marker, not a 404.** The plugin emits `html_inline` tokens wrapping a `<span class="wikilink-unpublished" title="…">`. A tiny custom theme at `site/.vitepress/theme/index.js` imports `site/.vitepress/theme/custom.css`, which dims the label, dotted-underlines it and appends " (not published)" via `::after`. A plain VitePress default-theme extension is safe — the hydration bug was caused by aliasing Vue, not by a custom theme.
- **Trim the nav too.** Removing folders is not enough if the top nav still links to `/instructions/...` or `/policies/...`; change `themeConfig.nav` in `config.mts`. It is now Home / Guides only, and `index.md` no longer links to the work instruction.
- **Verify beyond the build.** Check `site/.vitepress/dist/` contains only `guides/`, `index.html` and `404.html`; grep for `wikilink-unpublished` in a generated guide; confirm in a browser that the marker is visibly dimmed, sidebar toggles still work and the theme switch still responds.

> A public site is a **filter over the vault**, not a second vault. The filter belongs in one file and must be visible in the generated output.

### 4.6 Sidebar hierarchy, Nord styling and Mermaid

- **Numbers encode structure.** Guide filenames like `01-orient`, `01.2-types-and-taxonomy` and `02.2.1-assign-type-and-id` let `build-sidebar.mjs` build a real tree: chapter → section → detail. VitePress renders nested `items` as progressively indented, collapsible levels. Flat alphabetical lists are hard to scan; the tree mirrors how the course was designed.
- **DOM level is one deeper than expected.** The group wrapper is `VPSidebarItem.level-0`, so chapters are `level-1`, sections `level-2` and leaves `level-3`. Style `level-1` as the big chapter heading and `level-3` as the smallest detail. Getting this off by one makes the group title enormous.
- **Nord lives in CSS variables.** `theme/custom.css` overrides `--vp-c-*` variables twice: `:root` for Snow Storm surfaces with Frost accents, `.dark` for Polar Night surfaces with brighter Frost. One palette, two appearances; no separate stylesheets. Chapter items get a Frost left border to make 01 / 02 / 03 visually primary.
- **Mermaid needs a build step and a client step.** `mermaid.mjs` rewrites mermaid fences into `<div class="mermaid" data-source="…">`; `theme/MermaidMount.vue` dynamically imports Mermaid, initializes it with Nord `themeVariables`, and renders on mount, on route change and on a `MutationObserver` on the `html` class (theme switch). Use dynamic import so SSR never touches Mermaid.
- **VitePress collapses literal newlines in raw HTML.** The first attempt put the Mermaid source as text inside the div; Mermaid received one long line and failed with `Expecting 'NEWLINE', got 'NODE_STRING'`. The fix is to base64-encode the source into `data-source` and decode it in the browser with `TextDecoder`. Do not remove that attribute.
- Mermaid is now a real `npm` dependency; `package-lock.json` is committed so CI installs the same version. It is the only client-side dependency added for rendering.

### 4.7 Reader helpers — chapter banner, chapter nav, outline controls, memory

- **Use theme slots, not note edits.** `theme/index.js` extends the default theme and fills `doc-before`, `doc-after`, `sidebar-nav-before` and `layout-top`. VitePress 1.6.4 exposes these slots through `VPContent` / `VPSidebar`. No guide file needed changing.
- **Derive navigation from the generated sidebar.** `ChapterBanner.vue` and `ChapterNav.vue` import `../sidebar.json` and group items by the `NN-` prefix in their links. Renaming a guide file without keeping its number breaks the chapter grouping — a good reason to let the number lead the filename.
- **The banner diagram uses the same Mermaid pipeline.** It generates a `flowchart LR` from the chapter's sections and base64-encodes it into `data-source`, so `MermaidMount.vue` renders and re-renders it on theme changes exactly like a note diagram.
- **Prev/next is chapter-level, not page-level.** VitePress already adds small previous/next links per page; the extra footer links whole chapters (01 → 02 → 03), which is what a course reader needs.
- **Expand/collapse all works through the DOM.** VitePress stores each section's open state in a child component, so `SidebarControls.vue` clicks the visible `.caret` elements. It is simple, works in the mobile drawer, and needs no internal API.
- **Reading position is a link, not a redirect.** `MermaidMount.vue` saves the last `/guides/NN-…` path to `localStorage`; on the homepage `ChapterBanner.vue` shows a *Continue where you left off* card. Forcing a redirect on every home visit was avoided because it hides the onboarding hub from returning readers.
- **Use `withBase()` for links in theme components.** Hard-coded `/guides/...` hrefs would break under the `/qms-demo/` base.
- **SSR has no `btoa` or `localStorage`.** The banner's encoder falls back to `Buffer` in Node; reading position is guarded by `typeof window`. Forgetting either breaks `npm run docs:build`.
- **Sidebar typography must stay compact.** Chapter text is ~13.8px, sections ~12.8px, details ~12.1px, with line-height 1.3 and 3px item padding. The hierarchy is expressed through size/weight, not large type — the article should be the visual focus. On narrow screens the drawer is ~320px, so horizontal padding was reduced to 14px to avoid three-line chapter titles.
- **VitePress scopes `.VPSidebar` with a `data-v-…` attribute.** A plain `.VPSidebar { padding: … }` rule loses to the scoped default despite appearing later. Override only `padding-right/left/bottom` with `!important` and leave the top padding alone — it clears the fixed nav bar at desktop widths.

### 4.8 Diagram placeholders, wide views and hiding the navigation

- **Grey blocks were empty Mermaid cards.** `custom.css` styled every `.mermaid` div as a bordered grey card, including the milliseconds-to-seconds before (or after) an SVG existed. Now only `.mermaid.mermaid-ready` gets the card; an unrendered container shows a small "Preparing diagram…" label instead. `MermaidMount.vue` adds `mermaid-ready` after a successful render — and also when Mermaid throws a harmless post-render animation error (`n.transition is not a function`) but the SVG is present.
- **VitePress swaps page content asynchronously.** A `nextTick` after a route change can render the outgoing DOM, leaving new containers empty. A `MutationObserver` on `document.body` now watches for inserted `.mermaid[data-mermaid]` nodes that have no SVG, and `render()` skips already-rendered diagrams unless the theme changed. A `pending` flag reruns a render that arrived while one was in flight.
- **`mermaid wide`** in the fence info line adds the `mermaid-wide` class. CSS gives the SVG `min-width: 1100px` inside a horizontally scrollable card, so the full branch tree is readable instead of shrinking to fit. The hub note uses it for the 7-pathway overview.
- **Hiding the sidebar:** `SidebarToggle.vue` toggles `html.hide-sidebar`, persisted in `localStorage`; CSS hides `.VPSidebar` and removes the reserved `.VPContent.has-sidebar` padding (both need `!important` against scoped VitePress rules). A tiny script in `config.mts` head applies the saved class before paint to avoid a flash.
- **Slot choice matters:** `nav-bar-title-after` is nested inside the title `<a>`, so a button there navigates home on click. Use `nav-bar-content-before` for the navigation toggle — it is the first child of the flex `.content-body`. CSS `order: 10` on `.VPNavBarSearch` (and `11` on the hamburger) moves the search box to the far right, swapping the two controls as requested.
- **Pop-out overview:** `addExpandButton()` in `MermaidMount.vue` adds an **Expand overview** button to `mermaid-wide` diagrams. It clones the rendered SVG into a fixed overlay (no second Mermaid render), with +/− zoom via inline `width` and close via button, backdrop or Escape. The clone's `id` is removed to avoid duplicate SVG ids.

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
7. Decide the publish scope before the first deploy; keep it in one `publish-scope.mjs` module and derive exclusions, sidebar and link markers from it.
8. Expect cross-links from published notes into excluded ones; render them as explicit "not published" markers rather than broken links.
9. Test interactivity in a real browser (sidebar toggle, theme switch, one unpublished marker, and one Mermaid diagram in both themes), not just a successful build.
10. A public repo publishes whatever the build includes — verify the generated `dist/` folder before sharing widely.

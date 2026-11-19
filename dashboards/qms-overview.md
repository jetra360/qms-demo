---
type: Note
status: active
_organized: true
tags:
  - dashboard
open_capas: 1
open_nonconformances: 1
overdue_items: 1
drafts: 1
as_of: 2026-11-19
---
# QMS overview dashboard

A Tolaria-native dashboard. The block below is stored as fenced HTML inside this Markdown note and resolves Tolaria's double-curly-brace expressions from this note's frontmatter. Change a value in the Properties panel and the preview updates from the same file-backed values. The layout is proportional: cards share the width evenly and reflow on narrow screens.

```html height="220"
<style>
  :root { color-scheme: dark; }
  .qms-dash {
    box-sizing: border-box;
    width: 100%;
    min-height: 176px;
    padding: 20px;
    border-radius: 12px;
    background: #2E3440;
    color: #ECEFF4;
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(136px, 1fr));
    gap: 12px;
    flex: 1;
  }
  .card {
    box-sizing: border-box;
    min-height: 88px;
    padding: 14px 16px;
    border: 1px solid #4C566A;
    border-top: 3px solid var(--accent, #88C0D0);
    border-radius: 10px;
    background: #3B4252;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .label {
    font-size: clamp(10px, 1.05vw, 12px);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #D8DEE9;
    white-space: nowrap;
  }
  .value {
    font-size: clamp(26px, 3.2vw, 36px);
    font-weight: 700;
    line-height: 1;
    color: #ECEFF4;
  }
  .capa    { --accent: #BF616A; }
  .nc      { --accent: #D08770; }
  .overdue { --accent: #EBCB8B; }
  .draft   { --accent: #81A1C1; }
  .foot {
    font-size: clamp(10px, 1.05vw, 12px);
    line-height: 1.4;
    color: #8FBCBB;
  }
</style>

<section class="qms-dash">
  <div class="grid">
    <article class="card capa">
      <div class="label">Open CAPAs</div>
      <div class="value">{{open_capas}}</div>
    </article>
    <article class="card nc">
      <div class="label">Open NCs</div>
      <div class="value">{{open_nonconformances}}</div>
    </article>
    <article class="card overdue">
      <div class="label">Overdue</div>
      <div class="value">{{overdue_items}}</div>
    </article>
    <article class="card draft">
      <div class="label">Drafts</div>
      <div class="value">{{drafts}}</div>
    </article>
  </div>
  <div class="foot">As of {{formatDate(as_of, "long")}} · demo values from frontmatter; a published build would compute them from the registers.</div>
</section>
```

## Why this is the demo's "dashboard"

No plugin and no server: the dashboard reads the same frontmatter a human edits in the Properties panel. In the wider design described in `../QMS_Tolaria_Site.md`, a build script would compute these numbers from `registers/document-master.sheet.md` and publish a sanitised version to a website, hiding owner names and root causes. That pipeline is intentionally out of scope for this vault-only deliverable.

## Styling

Nord palette: Polar Night surfaces (`#2E3440`, `#3B4252`), Snow Storm text (`#ECEFF4`, `#D8DEE9`), Frost footer (`#8FBCBB`) and Aurora accents (`#BF616A`, `#D08770`, `#EBCB8B`, `#81A1C1`). Sizes use `clamp()` and an auto-fitting grid so the cards stay proportional at any panel width.

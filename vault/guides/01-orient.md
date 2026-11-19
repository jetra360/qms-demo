---
type: Note
status: active
_organized: true
tags:
  - onboarding
  - tier-01
description: "Pathway 1 — orient yourself and find anything in the QMS vault"
---
# 01 — Orient: find your way around

**Question this page answers:** *"Where is it, and what am I looking at?"*

## The pathway

```mermaid
flowchart TD
    S["Open the qms-vault folder in Tolaria"] --> T{"How do you want to find it?"}
    T -->|"by kind of thing"| TY["Sidebar groups by type<br/>Policy · SOP · Record · CAPA · AuditFinding"]
    T -->|"by a recurring question"| V["Views panel<br/>Controlled documents · Open nonconformances · Templates"]
    T -->|"by name or link"| W["Quick open / wikilinks<br/>filename or H1 title"]
    TY --> N["Open a note"]
    V --> N
    W --> N
    N --> F["Read frontmatter first<br/>type · status · doc_id · owner"]
    F --> B["Then read the body<br/>Purpose → Procedure → Records"]
    B --> L["Follow a wikilink to the next note"]
    L -.-> T
```

## Analogy

> **Library card catalog and the book.** The frontmatter is the index card: edition, owner, due date, shelf. The body is the book itself. You search the cards, not every page of every book. Types are the catalog drawers; Views are pre-written search slips you keep reusing.

## Why / when / who / where

| | |
|---|---|
| **Why** | A QMS fails when nobody can find the current version. Structure kills that. |
| **When** | On first opening the vault, and any time you need to locate a document. |
| **Who** | Everyone — managers, auditors, operators, AI agents. |
| **Where** | Sidebar (Types), Views panel (`views/`), quick open, and wikilinks in note bodies. |

## Branches from here

- [[01.1-anatomy-of-a-note]] — read a note correctly
- [[01.2-types-and-taxonomy]] — how types work
- [[01.3-views-and-navigation]] — saved questions
- [[01.4-wikilinks-and-backlinks]] — the graph

## Go deeper

- [[sop-template]] — see how a reusable form looks in Tolaria
- [[sop-lifecycle]] — a worked diagram of one document's life
- [[nc-lifecycle]] — the operational pathway in detail
- [[iso-9001-map]] — the clause reference map

## Back

[[00-start-here]] — return to the top-level map.

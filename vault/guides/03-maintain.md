---
type: Note
status: active
_organized: true
tags:
  - onboarding
  - tier-03
description: "Pathway 3 — create, revise and approve controlled documents"
---
# 03 — Maintain: controlled documents

**Question this page answers:** *"How do I write a new SOP or revise an existing one without breaking control?"*

## The pathway

```mermaid
flowchart TD
    TP["TEMPLATE<br/>templates/sop-template.md<br/>or Type document"] --> D["DRAFT<br/>procedures/SOP-XXX.md<br/>status: draft · approver empty"]
    D --> AI["AI / MCP may write<br/>the draft only"]
    D --> V1(["Unapproved drafts view"])
    V1 --> HR{"HUMAN reviews<br/>diff + Properties panel"}
    HR -->|changes requested| D
    HR -->|approved| UR["status: under_review<br/>approver: QA manager"]
    UR --> GIT["Git: review diff → merge<br/>merge = approval record"]
    GIT --> ACT["status: active<br/>effective = approval date"]
    ACT --> V2(["Controlled documents view"])
    ACT --> REV["Periodic review<br/>review_due reached → revision +1"]
    REV --> HR
```

## Analogy

> **A notarised filing cabinet with a tamper-evident log.** The document is the paper; Git is the notary who records every change, who made it and when. A Word file called `final_v2_REAL_final(2).docx` is a shoebox. The template is the pre-printed form so you stop inventing the shape each time.

## Why / when / who / where

| | |
|---|---|
| **Why** | Auditors distinguish a *documented* control from an *effective* one. A rule enforced by a machine is effective by definition. |
| **When** | New process, a change request, a CAPA action, or an upcoming `review_due`. |
| **Who** | QA engineer drafts; QA manager approves; AI may assist only up to `draft`. |
| **Where** | `types/` (schema), `templates/` (forms), `policies/`, `procedures/`, `instructions/`; views `unapproved-drafts.yml`, `overdue-reviews.yml`. |

## Branches from here

- [[03.1-write-a-policy]] — top-level commitment
- [[03.2-write-an-sop]] — controlled procedure
- [[03.3-work-instructions]] — task-level detail
- [[03.4-revisions-and-git]] — versioning and approval
- [[03.5-templates-and-ai-drafting]] — drafting with assistance

## Go deeper

- [[sop-lifecycle]] — the two diagrams for template → controlled document
- [[sop-template]] — the source form
- [[ai-sop-draft-prompt]] — the prompt for the first transition
- [[POL-QUAL-001]] — a controlled policy with a revision history

## Back

[[00-start-here]] — return to the top-level map.

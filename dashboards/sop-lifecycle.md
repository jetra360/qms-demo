---
type: Note
status: active
_organized: true
tags:
- sop
- diagram
- ai-workflow
---
# SOP lifecycle — template to controlled document

How `templates/sop-template.md` becomes an active SOP, and where the human approval gate sits. The step-by-step interaction is in **"Drafting an SOP with AI"** in the vault README; the prompt to paste is [[ai-sop-draft-prompt]].

## Lifecycle flow

```mermaid
flowchart TD
    subgraph TPL["TEMPLATE — templates/"]
        TP["sop-template.md<br/>type: Note · status: template<br/>Purpose / Scope / Responsibilities<br/>Procedure / Records / References"]
    end

    TP -->|"AI reads template + Type doc + a policy"| DRAFT

    subgraph AIW["AI / MCP — writes a draft file"]
        DRAFT["procedures/SOP-XXX.md<br/>type: SOP · revision: 1 · status: draft<br/>author: ai · approver: empty<br/>implements: POL-QUAL-001"]
    end

    DRAFT --> V1(["Unapproved drafts<br/>type: SOP AND status: draft"])
    V1 --> HR{"HUMAN reviews<br/>diff + Properties panel"}

    HR -->|"changes requested"| DRAFT
    HR -->|"approved"| UR["status: under_review<br/>approver: QA manager<br/>effective: planned date"]

    UR --> GIT["Git: review diff → merge<br/>merge = approval record"]
    GIT --> ACT["status: active<br/>effective: approval date<br/>SOP now controlled"]

    ACT --> V2(["All quality documents<br/>+ policy backlinks"])
    ACT --> REV{"review_due reached?"}
    REV -->|"yes"| OV(["Overdue / under review"])
    OV --> REVUP["revision +1<br/>status: under_review<br/>link finding/CAPA"]
    REVUP --> HR

    classDef tpl fill:#3B4252,stroke:#B48EAD,color:#ECEFF4
    classDef ai fill:#3B4252,stroke:#81A1C1,color:#ECEFF4
    classDef human fill:#3B4252,stroke:#BF616A,color:#ECEFF4
    classDef live fill:#3B4252,stroke:#A3BE8C,color:#ECEFF4
    classDef view fill:#3B4252,stroke:#88C0D0,color:#ECEFF4

    class TP tpl
    class DRAFT ai
    class HR,UR,GIT human
    class ACT,REVUP live
    class V1,V2,OV view
```

## Status transitions of the SOP note

```mermaid
stateDiagram-v2
    state "Template (status: template)" as Template
    state "Draft (AI-written, author: ai)" as Draft
    state "Under review (human)" as Review
    state "Active (approved)" as Active
    state "Superseded (old rev in Git)" as Old

    [*] --> Template
    Template --> Draft : AI creates copy
    Draft --> Review : human sends for review
    Review --> Draft : changes requested
    Review --> Active : human sets approver + effective
    Active --> Review : review_due reached, rev +1
    Active --> Old : new revision published
    Old --> [*]
```

## Reading the diagram

| Colour | Stage | Who acts |
|---|---|---|
| 🟣 Purple | Reusable form — never a record | — |
| 🔵 Blue | Draft written from the template | AI / MCP |
| 🔴 Red | Review, approval decision, Git merge | **Human only** |
| 🟢 Green | Controlled and active | QMS |
| 🔵 Cyan | Computed views | Tolaria |

- The **template** is a starting shape, not a controlled document (`status: template`).
- **AI/MCP writes only `status: draft`** notes with `author: ai` and an empty `approver`.
- The **merge of the reviewed diff is the approval event**; that is why Git matters for AI here.
- **Only a human** sets `status: active`, `approver` and `effective`. This rule is in `AGENTS.md`.
- When `review_due` arrives, the SOP re-enters review at `revision + 1`; the old revision stays in Git history.

## Related

- [[sop-template]] — the source form
- [[ai-sop-draft-prompt]] — the prompt that performs the first transition
- [[SOP-QA-001]] — house-style example of a controlled SOP
- [[POL-QUAL-001]] — the policy a new SOP implements

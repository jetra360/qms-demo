---
type: Note
status: active
_organized: true
tags:
  - onboarding
  - tier-02
description: "Pathway 2 — daily capture, triage and evidence of nonconformance"
_width: wide
---
# 02 — Operate: the daily pathway

**Question this page answers:** *"Something went wrong on the floor. What do I do, and where is it logged?"*

## The pathway

```mermaid
flowchart TD
    D["Detect a nonconformance"] --> C["CONTAIN<br/>segregate the material"]
    C --> CAP["CAPTURE<br/>inbox/NC-YYYY-MM-DD-NNN.md<br/>captured_on + tags, detail in body"]
    CAP --> V1(["Inbox triage queue<br/>tags contains untriaged"])
    V1 --> T{"QA triage<br/>within 1 business day"}
    T --> A["Set type AuditFinding, doc_id,<br/>severity, owner, due, status open<br/>tag operator, move to audits/"]
    A --> V2(["Open nonconformances"])
    A --> E["EVALUATE + DISPOSITION<br/>same note"]
    E --> R["RECORD EVIDENCE<br/>records/REC-NC-….md"]
    E --> Q{"Systemic cause?"}
    Q -->|Yes| CAPA["CAPA via related_to"]
    Q -->|No| CL
    CAPA --> CL["VERIFY + CLOSE<br/>human only"]
    CL --> V3(["All nonconformances"])
```

## Analogy

> **A suggestion box that actually gets emptied and sorted.** The Inbox is the slot in the wall — fast to use, no perfect form required. Triage is the person who opens the box each morning and files each note properly. The *Record* note is the signed receipt that proves the action really happened.

## Why / when / who / where

| | |
|---|---|
| **Why** | An undocumented problem disappears; a logged problem can be proven fixed. |
| **When** | Same shift as detection; triage within one business day. |
| **Who** | Operator captures; QA engineer triages and investigates; QA manager authorises disposition. |
| **Where** | `inbox/` → `audits/` → `records/` → `capa/`; views `nc-triage.yml`, `nonconformances-open.yml`. |

## Branches from here

- [[02.1-capture-the-condition]] — the Inbox note
- [[02.2-triage-into-a-finding]] — classification
- [[02.3-disposition-and-evidence]] — proof it happened

## Go deeper

- [[nc-lifecycle]] — full Mermaid lifecycle and status transitions
- [[nonconformance-report]] — the capture form to copy
- [[NC-2026-11-19-002]] — an untriaged example
- [[NC-2026-11-19-001]] — the same flow after triage

## Back

[[00-start-here]] — return to the top-level map.

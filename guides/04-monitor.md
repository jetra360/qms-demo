---
type: Note
status: active
_organized: true
tags:
  - onboarding
  - tier-04
description: "Pathway 4 — monitor status with views, registers and the dashboard"
---
# 04 — Monitor: the control tower

**Question this page answers:** *"What is overdue, open, draft, or drifting right now?"*

## The pathway

```mermaid
flowchart TD
    F["Every note carries frontmatter<br/>type · status · due · review_due"] --> V["Saved views compute the answer<br/>no manual list to maintain"]
    V --> V1["Controlled documents"]
    V --> V2["Overdue / under review"]
    V --> V3["Open CAPAs · Open nonconformances"]
    V --> V4["Unapproved drafts · Inbox triage"]
    R["Registers in registers/<br/>document master · risk · RACI"] --> X["Validator checks sheet vs file<br/>scripts/validate-vault.py"]
    V --> D["HTML dashboard<br/>dashboards/qms-overview"]
    D --> DEC["Management decision<br/>assign owner · escalate · approve"]
    X --> DEC
    DEC -.-> F
```

## Analogy

> **The control tower and the planes.** The notes are the planes; the views are the tower screens saying which plane is late for maintenance. Better still, it is a **turnstile that counts automatically** — the status is computed from the files, so it cannot be forgotten by a human maintaining a spreadsheet.

## Why / when / who / where

| | |
|---|---|
| **Why** | Document control done by memory is a finding waiting to happen. Computed state is always current. |
| **When** | Daily at the start of the shift; before an audit; before committing changes. |
| **Who** | QA manager reviews; stakeholders read the dashboards and register summaries. |
| **Where** | `views/*.yml`, `registers/*.sheet.md`, `dashboards/qms-overview.md`, `scripts/validate-vault.py`. |

## Branches from here

- [[04.1-build-a-saved-view]] — make a question reusable
- [[04.2-register-sheets]] — readable registers
- [[04.3-the-dashboard]] — status at a glance
- [[04.4-validate-and-catch-drift]] — the machine guard

## Go deeper

- [[qms-overview]] — the frontmatter-driven HTML dashboard
- [[document-master.sheet]] — the controlled-document index
- [[risk-register.sheet]] — risk scores with sheet formulas
- [[raci-obligations.sheet]] — rights and duties matrix

## Back

[[00-start-here]] — return to the top-level map.

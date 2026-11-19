---
type: Note
status: active
_organized: true
tags:
  - onboarding
  - tier-05
description: "Pathway 5 — audit findings, CAPA, verification and closure"
---
# 05 — Improve: close the loop

**Question this page answers:** *"We found a systemic problem. How is it fixed and proven?"*

## The pathway

```mermaid
flowchart TD
    A["INTERNAL AUDIT<br/>audits/AUDIT-2026-Q1"] --> F["AUDIT FINDING<br/>condition · criteria · consequence"]
    F --> C["CAPA<br/>root cause · corrective action<br/>owner · due · severity"]
    C --> L["Link with related_to<br/>policy · SOP · finding"]
    L --> IM["Implement the change<br/>revise the SOP, retrain staff"]
    IM --> V["VERIFY EFFECTIVENESS<br/>human only"]
    V --> CL["CLOSE<br/>status closed<br/>verified_by · closed_on"]
    CL --> FB["Feedback into the procedure<br/>backlink shows the finding on the SOP"]
    FB -.-> A
```

## Analogy

> **A family tree for rules.** Open a great-grandparent policy and see every child SOP, record and open finding beneath it. The loop — policy → SOP → practice → problem → fix → policy updated — is what ISO calls *continual improvement*. With bidirectional links it is visible instead of aspirational.

## Why / when / who / where

| | |
|---|---|
| **Why** | An auditor asks "show me continual improvement". A closed, linked CAPA is the answer. |
| **When** | Quarterly internal audits; any repeated or systemic nonconformance. |
| **Who** | QA director audits and verifies; QA engineer owns actions; nobody but a human closes. |
| **Where** | `audits/`, `capa/`, `records/`; views `open-capas.yml`, `nonconformances-open.yml`. |

## Branches from here

- [[05.1-run-an-internal-audit]] — schedule and evidence
- [[05.2-write-a-finding]] — condition, criteria, consequence
- [[05.3-capa-lifecycle]] — root cause to action
- [[05.4-verification-and-closure]] — the human signature

## Go deeper

- [[AUDIT-2026-Q1]] — a worked audit finding
- [[CAPA-2026-002]] — an open CAPA with verification pending
- [[CAPA-2026-001]] — a closed CAPA with human attestation
- [[nc-lifecycle]] — how a nonconformance feeds this loop

## Back

[[00-start-here]] — return to the top-level map.

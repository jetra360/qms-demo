---
type: Note
status: active
_organized: true
tags:
- nonconformance
- diagram
- operational-overview
_width: wide
---
# Nonconformance lifecycle

From the reusable **template** to a **closed report** — the operational path defined in [[SOP-QA-002]] step 2.

## Process flow

```mermaid
flowchart TD
    T["TEMPLATE · templates/nonconformance-report.md<br/>type: Note · status: template"]

    subgraph S12["STEP 1–2 · CAPTURE — inbox/"]
        C["inbox/NC-YYYY-MM-DD-NNN.md<br/>untyped · tags: nonconformance, untriaged<br/>captured_on in YAML · reporter, product, batch<br/>and containment in the body"]
    end

    T -->|"operator copies the form"| C
    C --> V1(["Inbox triage queue<br/>view: tags contains untriaged"])
    V1 --> Q{"QA triage — within 1 business day"}
    Q -->|"type: AuditFinding · doc_id · severity<br/>owner · due · status: open · _organized: true<br/>swap tag to triaged · add operator tag<br/>move to audits/"| A["audits/NC-….md<br/>tags: nonconformance, triaged, operator"]
    A --> V2(["Open nonconformances<br/>type: AuditFinding AND status: open"])
    V2 --> E["STEP 3–4 · evaluate impact + record disposition<br/>same note"]
    E --> R["records/REC-NC-….md<br/>type: Record · signed evidence"]
    E --> D{"Systemic cause?"}
    D -->|Yes| CAP["capa/CAPA-….md<br/>related_to points to NC-…"]
    D -->|No| CL
    CAP --> CL["STEP 6 · verification and closure — HUMAN ONLY<br/>status: closed · verified_by · closed_on"]
    CL --> V3(["All nonconformances<br/>permanent audit list"])
    V3 -.->|"backlink closes the loop"| SOP["procedures/SOP-QA-002.md"]

    classDef template fill:#3B4252,stroke:#B48EAD,color:#ECEFF4
    classDef capture fill:#3B4252,stroke:#EBCB8B,color:#ECEFF4
    classDef active fill:#3B4252,stroke:#BF616A,color:#ECEFF4
    classDef done fill:#3B4252,stroke:#A3BE8C,color:#ECEFF4
    classDef view fill:#3B4252,stroke:#88C0D0,color:#ECEFF4

    class T template
    class C capture
    class A,R,CAP active
    class CL done
    class V1,V2,V3 view
```

## Status transitions of the incident note

```mermaid
stateDiagram-v2
    direction LR
    state "Template (status: template)" as Template
    state "Captured (no type, untriaged)" as Captured
    state "Open (AuditFinding, tag: operator)" as Open
    state "Closed (verified_by + closed_on)" as Closed

    [*] --> Template
    Template --> Captured : copied into inbox/
    Captured --> Open : QA triage
    Open --> Closed : human verification
    Closed --> [*]
```

## Reading the diagram

- The **template** is never a record: `status: template`, `type: Note`. It is only a form to copy.
- **Capture** produces an untyped note in `inbox/`. It is not yet in the controlled register.
- **Triage** is the only moment the note becomes a controlled `AuditFinding` — and when the `operator` tag is added.
- The **Record** note is the proof; the **CAPA** is optional and only for a systemic cause.
- **Closure is human-only** — the agent rules in `AGENTS.md` forbid setting `status: active` or closing a CAPA.
- The backlink to [[SOP-QA-002]] closes the loop: the procedure shows the findings raised against it.

## Worked examples in this vault

| Stage | Note |
|---|---|
| Template | [[nonconformance-report]] |
| Captured, untriaged | [[NC-2026-11-19-002]] |
| Triaged, open | [[NC-2026-11-19-001]] |
| Disposition evidence | [[REC-NC-2026-11-19-001]] |
| CAPA link | [[CAPA-2026-002]] |

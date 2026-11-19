---
type: Register
doc_id: REG-RISK
status: active
owner: '[[qa-manager]]'
_display: sheet
_organized: true
_sheet:
  frozen_rows: 1
  columns:
    A:
      width: 140
    B:
      width: 300
    C:
      width: 120
    D:
      width: 100
    E:
      width: 110
    F:
      width: 150
    G:
      width: 320
    H:
      width: 110
  rows:
    '1':
      height: 30
  cells:
    A1:
      bold: true
    B1:
      bold: true
    C1:
      bold: true
    D1:
      bold: true
    E1:
      bold: true
    F1:
      bold: true
    G1:
      bold: true
    H1:
      bold: true
---
RISK ID,DESCRIPTION,LIKELIHOOD,IMPACT,SCORE,OWNER,MITIGATION,STATUS
R-001,Supplier delivers non-conforming material,4,5,=C2*D2,[[qa-engineer]],AQL 1.0 sampling per [[SOP-QA-001]] and monitored scorecard,open
R-002,Controlled document past review date,3,4,=C3*D3,[[qa-manager]],Overdue saved view plus planned CI gate,open
R-003,Operator uses obsolete work instruction,2,5,=C4*D4,[[prod-manager]],Git history and single published source,open
R-004,Training record expires unnoticed,2,3,=C5*D5,[[qa-manager]],Annual refresher reminder,open
R-005,Unauthorized change to controlled document,1,5,=C6*D6,[[qa-director]],Branch review and signed merge,closed

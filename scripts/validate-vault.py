#!/usr/bin/env python3
"""Validate the QMS vault's document-control invariants.

Run from anywhere:  python3 scripts/validate-vault.py
Exit code 1 means at least one error. Warnings do not fail the check.
Uses only the Python standard library.
"""
import csv
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTROLLED = {"Policy", "SOP", "WorkInstruction"}

errors = []
warnings = []


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def frontmatter(text):
    """Return the small set of flat fields we validate, plus the body."""
    if not text.startswith("---\n"):
        return {}, text
    parts = text.split("---\n", 2)
    if len(parts) < 3:
        return {}, text
    meta = {}
    for line in parts[1].splitlines():
        # Only top-level scalar lines; nested _sheet keys and list items are ignored.
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$", line)
        if m:
            val = m.group(2).strip().strip("'\"")
            # Type documents use empty placeholders; they are not real values.
            if val not in ("", "null", "~"):
                meta[m.group(1)] = val
    return meta, parts[2]


md_files = []
for dirpath, _, names in os.walk(ROOT):
    for name in names:
        if name.endswith(".md"):
            md_files.append(os.path.join(dirpath, name))

stems = set()
titles = set()
doc_ids = {}
revisions = {}
controlled_active = []

for path in md_files:
    rel = os.path.relpath(path, ROOT)
    text = read(path)
    meta, body = frontmatter(text)
    stem = os.path.basename(path)[:-3]
    stems.add(stem)
    h1 = re.search(r"^# (.+)$", body, re.M)
    if h1:
        titles.add(h1.group(1).strip())

    doc_id = meta.get("doc_id")
    if doc_id:
        if doc_id in doc_ids:
            errors.append(f"duplicate doc_id '{doc_id}' in {rel} and {doc_ids[doc_id]}")
        else:
            doc_ids[doc_id] = rel
        if meta.get("type") != "Register" and stem != doc_id:
            errors.append(f"{rel}: filename stem '{stem}' != doc_id '{doc_id}'")
        rev = meta.get("revision")
        if rev is not None:
            revisions[doc_id] = rev

    if meta.get("type") in CONTROLLED:
        if meta.get("status") == "active":
            controlled_active.append((rel, meta))
        if meta.get("status") == "active" and not meta.get("approver"):
            errors.append(f"{rel}: status active but approver is empty")
        if meta.get("status") == "active" and not meta.get("effective"):
            errors.append(f"{rel}: status active but effective is empty")
        review = meta.get("review_due")
        if review and meta.get("status") == "active" and review < "2026-11-19":
            warnings.append(f"{rel}: review_due {review} is past and status is still active")

# Master sheet: index must agree with the files.
sheet_path = os.path.join(ROOT, "registers", "document-master.sheet.md")
sheet_rows = {}
if os.path.exists(sheet_path):
    lines = read(sheet_path).splitlines()
    try:
        start = next(i for i, line in enumerate(lines) if line.startswith("DOC ID,"))
        for row in list(csv.reader(lines[start:]))[1:]:
            if len(row) < 4 or not row[0].strip():
                continue
            sid, srev = row[0].strip(), row[3].strip()
            if sid in sheet_rows:
                errors.append(f"document-master.sheet: duplicate DOC ID '{sid}'")
            sheet_rows[sid] = srev
            if sid in revisions and srev.isdigit() and srev != str(revisions[sid]):
                errors.append(
                    f"document-master.sheet: {sid} revision {srev} != file revision {revisions[sid]}"
                )
            if sid not in doc_ids:
                warnings.append(f"document-master.sheet: '{sid}' has no matching note")
    except StopIteration:
        errors.append("document-master.sheet: header 'DOC ID,...' not found")

# All wikilinks must resolve to a filename stem or an H1 title.
for path in md_files:
    text = read(path)
    for raw in re.findall(r"\[\[([^\]]+)\]\]", text):
        target = raw.split("|")[0].strip()
        if target not in stems and target not in titles:
            errors.append(f"{os.path.relpath(path, ROOT)}: broken wikilink [[{target}]]")

print(f"Checked {len(md_files)} notes, {len(doc_ids)} doc_ids, {len(sheet_rows)} sheet rows")
for w in warnings:
    print("WARN ", w)
for e in errors:
    print("ERROR", e)
print(f"Result: {len(errors)} errors, {len(warnings)} warnings")
sys.exit(1 if errors else 0)

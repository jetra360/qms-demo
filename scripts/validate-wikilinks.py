"""Validate frontmatter, saved views and wikilinks in this vault.

Run from anywhere:  python3 scripts/validate-wikilinks.py

Wikilinks that point at the *other* site are resolved through
site/.vitepress/remote-manifest.json, so cross-site links are not reported
as broken.
"""

import json
import os
import re
import sys

import yaml

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'vault')
errors = []
stems = {}
titles = {}

files = []
for dirpath, dirs, names in os.walk(ROOT):
    dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('site', 'node_modules')]
    for n in names:
        files.append(os.path.join(dirpath, n))

md_files = [f for f in files if f.endswith('.md')]

for f in md_files:
    text = open(f, encoding='utf-8').read()
    rel = os.path.relpath(f, ROOT)
    if not text.startswith('---\n'):
        errors.append(f'{rel}: missing frontmatter delimiters')
        continue
    parts = text.split('---\n', 2)
    if len(parts) < 3:
        errors.append(f'{rel}: unclosed frontmatter')
        continue
    try:
        meta = yaml.safe_load(parts[1]) or {}
    except Exception as e:
        errors.append(f'{rel}: YAML ERROR: {e}')
        continue
    m = re.search(r'^# (.+)$', parts[2], re.M)
    h1 = m.group(1).strip() if m else None
    stems[os.path.basename(f)[:-3]] = rel
    if h1:
        titles[h1] = rel
    if 'type' not in meta:
        errors.append(f'{rel}: no type field (OK only for inbox captures)')
    if meta.get('type') == 'Type' and not h1:
        errors.append(f'{rel}: Type doc without H1')

for f in files:
    if f.endswith('.yml'):
        rel = os.path.relpath(f, ROOT)
        try:
            v = yaml.safe_load(open(f, encoding='utf-8').read())
            if 'filters' not in v or 'name' not in v:
                errors.append(f'{rel}: missing name/filters')
        except Exception as e:
            errors.append(f'{rel}: YAML ERROR: {e}')

remote_path = os.path.join(ROOT, '..', 'site', '.vitepress', 'remote-manifest.json')
remote = {}
if os.path.exists(remote_path):
    remote = json.load(open(remote_path, encoding='utf-8'))

link_re = re.compile(r'\[\[([^\]]+)\]\]')
broken = []
for f in md_files:
    text = open(f, encoding='utf-8').read()
    rel = os.path.relpath(f, ROOT)
    for raw in link_re.findall(text):
        target = raw.split('|')[0].strip()
        if target in stems or target in titles or target in remote:
            continue
        if os.path.basename(target) in stems or target.lower() in remote:
            continue
        broken.append((rel, target))

print(f'Markdown files: {len(md_files)}')
print(f'Known stems: {len(stems)}; titles: {len(titles)}; remote: {len(remote)}')
print(f'Frontmatter/YAML errors: {len(errors)}')
for e in errors:
    print('  ERR', e)
print(f'Broken wikilinks: {len(broken)}')
for rel, target in broken:
    print(f'  BROKEN {rel} -> [[{target}]]')

type_docs = {}
for f in md_files:
    text = open(f, encoding='utf-8').read()
    if text.startswith('---\n'):
        meta = yaml.safe_load(text.split('---\n', 2)[1]) or {}
        if meta.get('type') == 'Type':
            m = re.search(r'^# (.+)$', text.split('---\n', 2)[2], re.M)
            if m:
                type_docs[m.group(1).strip()] = 1
used = set()
for f in md_files:
    text = open(f, encoding='utf-8').read()
    if text.startswith('---\n'):
        meta = yaml.safe_load(text.split('---\n', 2)[1]) or {}
        t = meta.get('type')
        if t and t != 'Type':
            used.add(t)
print('Declared types:', sorted(type_docs))
print('Used types   :', sorted(used))
print('Used but undeclared:', sorted(used - set(type_docs)))

# The four frontmatter notices (AGENTS.md and three untyped inbox captures)
# are intentional; only genuinely broken links fail the check.
if broken:
    sys.exit(1)

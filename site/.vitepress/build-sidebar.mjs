// Generates sidebar.json from the vault folder structure.
// Run automatically by docs:dev and docs:build, so navigation never goes stale.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const vaultRoot = path.resolve(here, '../..')
const SKIP = new Set(['site', 'node_modules', '.git', '.vitepress', 'attachments'])

function titleOf(file) {
  const text = fs.readFileSync(file, 'utf8')
  const h1 = /^# (.+)$/m.exec(text)
  return h1 ? h1[1].trim() : path.basename(file, '.md')
}

const groups = new Map()

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
      continue
    }
    if (!entry.name.endsWith('.md')) continue

    const rel = path.relative(vaultRoot, full).split(path.sep).join('/')
    const folder = path.dirname(rel) === '.' ? 'Top level' : path.dirname(rel)
    const link = '/' + rel.slice(0, -3)
    if (!groups.has(folder)) groups.set(folder, [])
    groups.get(folder).push({ text: titleOf(full), link })
  }
}

walk(vaultRoot)

const preferred = ['Top level', 'guides', 'types', 'policies', 'procedures',
  'instructions', 'records', 'audits', 'capa', 'registers', 'inbox',
  'templates', 'dashboards', 'people', 'roles', 'iso-9001']

const sidebar = [...groups.entries()]
  .sort(([a], [b]) => {
    const ia = preferred.indexOf(a)
    const ib = preferred.indexOf(b)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b)
  })
  .map(([folder, items]) => ({
    text: folder === 'Top level' ? 'Overview' : folder.split('/').pop(),
    collapsed: true,
    items: items.sort((a, b) => a.text.localeCompare(b.text)),
  }))

fs.writeFileSync(path.join(here, 'sidebar.json'), JSON.stringify({ '/': sidebar }, null, 2) + '\n')
const total = [...groups.values()].reduce((n, items) => n + items.length, 0)
console.log(`sidebar.json: ${sidebar.length} groups, ${total} pages`)

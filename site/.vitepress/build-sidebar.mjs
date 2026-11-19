// Generates sidebar.json from the published subset of the vault.
// Run automatically by docs:dev and docs:build, so navigation never goes stale.
// The scope comes from publish-scope.mjs, the same module the build uses.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PUBLISHED_FOLDERS, isPublished } from './publish-scope.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const vaultRoot = path.resolve(here, '../..')

const TITLES = { guides: 'Guides', instructions: 'Instructions' }

function titleOf(file) {
  const text = fs.readFileSync(file, 'utf8')
  const h1 = /^# (.+)$/m.exec(text)
  return h1 ? h1[1].trim() : path.basename(file, '.md')
}

const groups = new Map()

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'site' || entry.name === 'node_modules') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
      continue
    }
    if (!entry.name.endsWith('.md')) continue

    const rel = path.relative(vaultRoot, full).split(path.sep).join('/')
    if (!isPublished(rel)) continue

    const slash = rel.indexOf('/')
    if (slash === -1) continue // homepage is reached from the nav, not the sidebar
    const folder = rel.slice(0, slash)
    if (!PUBLISHED_FOLDERS.includes(folder)) continue

    const link = '/' + rel.slice(0, -3)
    if (!groups.has(folder)) groups.set(folder, [])
    groups.get(folder).push({ text: titleOf(full), link })
  }
}

walk(vaultRoot)

const sidebar = PUBLISHED_FOLDERS
  .filter((folder) => groups.has(folder))
  .map((folder) => ({
    text: TITLES[folder] || folder,
    collapsed: true,
    items: groups.get(folder).sort((a, b) => a.text.localeCompare(b.text)),
  }))

fs.writeFileSync(path.join(here, 'sidebar.json'), JSON.stringify({ '/': sidebar }, null, 2) + '\n')
const total = sidebar.reduce((n, group) => n + group.items.length, 0)
console.log(`sidebar.json: ${sidebar.length} groups, ${total} pages`)

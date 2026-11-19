// Generates a hierarchical sidebar from the published subset of the vault.
// Guide numbers encode structure: 01 -> chapter, 01.2 -> section, 01.2.1 ->
// subsection. That structure becomes real nested, collapsible sidebar items,
// so the reader sees 01..07 first and drills down only when needed.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PUBLISHED_FOLDERS, isPublished } from './publish-scope.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const vaultRoot = path.resolve(here, '../..')

const TITLES = { guides: 'Guides' }

function titleOf(file) {
  const text = fs.readFileSync(file, 'utf8')
  const h1 = /^# (.+)$/m.exec(text)
  return h1 ? h1[1].trim() : path.basename(file, '.md')
}

function numberOf(stem) {
  const m = /^(\d{2})(?:\.(\d{1,2}))?(?:\.(\d{1,2}))?(?:-|$)/.exec(stem)
  return m ? [Number(m[1]), m[2] ? Number(m[2]) : null, m[3] ? Number(m[3]) : null] : null
}

function pad(n) {
  return String(n).padStart(2, '0')
}

let nodeId = 0
function node(num) {
  return { num, text: '', link: null, children: [], id: nodeId++ }
}

function sortNodes(list, key) {
  list.sort((a, b) => a.num[key] - b.num[key])
  list.forEach((n) => sortNodes(n.children, key + 1))
}

function toItem(n) {
  const item = { text: n.text }
  if (n.link) item.link = n.link
  if (n.children.length) {
    item.collapsed = true
    item.items = n.children.map(toItem)
  }
  return item
}

const chapters = new Map()
const loose = []
const folders = new Map(PUBLISHED_FOLDERS.map((f) => [f, []]))

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
    if (slash === -1) continue
    const folder = rel.slice(0, slash)
    if (!folders.has(folder)) continue

    const item = { text: titleOf(full), link: '/' + rel.slice(0, -3) }
    if (folder !== 'guides') {
      folders.get(folder).push(item)
      continue
    }

    const num = numberOf(entry.name.slice(0, -3))
    if (!num) {
      loose.push(item)
      continue
    }
    const [a, b, c] = num
    let chapter = chapters.get(a)
    if (!chapter) {
      chapter = node([a, null, null])
      chapter.text = `Chapter ${pad(a)}`
      chapters.set(a, chapter)
    }
    if (b === null) {
      chapter.text = item.text
      chapter.link = item.link
      continue
    }
    let section = chapter.children.find((n) => n.num[1] === b && n.num[2] === null)
    if (!section) {
      section = node([a, b, null])
      section.text = `${pad(a)}.${b}`
      chapter.children.push(section)
    }
    if (c === null) {
      section.text = item.text
      section.link = item.link
      continue
    }
    const leaf = node([a, b, c])
    leaf.text = item.text
    leaf.link = item.link
    section.children.push(leaf)
  }
}

walk(vaultRoot)

const chapterList = [...chapters.values()]
sortNodes(chapterList, 0)
const guides = [...loose, ...chapterList].map(toItem)
folders.set('guides', guides)

const sidebar = PUBLISHED_FOLDERS
  .filter((folder) => folders.get(folder).length)
  .map((folder) => ({
    text: TITLES[folder] || folder,
    // Show the chapter list immediately; chapters themselves start collapsed.
    collapsed: false,
    items: folders.get(folder),
  }))

fs.writeFileSync(path.join(here, 'sidebar.json'), JSON.stringify({ '/': sidebar }, null, 2) + '\n')
const count = (items) => items.reduce((n, i) => n + 1 + (i.items ? count(i.items) : 0), 0)
const total = sidebar.reduce((n, group) => n + count(group.items), 0)
const chaptersCount = chapterList.filter((c) => c.children.length).length
console.log(`sidebar.json: ${sidebar.length} groups, ${chaptersCount} chapters, ${total} pages`)

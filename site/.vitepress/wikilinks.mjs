// Converts Tolaria [[wikilinks]] into real VitePress links.
// The vault is the source of truth: this plugin only rewrites rendered output,
// it never changes the Markdown files on disk.

import fs from 'node:fs'
import path from 'node:path'

export function buildNoteMap(vaultRoot) {
  const map = new Map()

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'site') continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      if (!entry.name.endsWith('.md')) continue

      const stem = entry.name.slice(0, -3)
      const rel = path.relative(vaultRoot, full).split(path.sep).join('/')
      const route = '/' + rel.slice(0, -3)

      map.set(stem, route)
      map.set(stem.toLowerCase(), route)
      map.set(rel, route)
    }
  }

  walk(vaultRoot)
  return map
}

export function wikilinkPlugin(map) {
  return (md) => {
    md.inline.ruler.before('text', 'tolaria_wikilink', (state, silent) => {
      if (state.src[state.pos] !== '[' || state.src[state.pos + 1] !== '[') return false

      const match = /^\[\[([^\]\n]+)\]\]/.exec(state.src.slice(state.pos))
      if (!match) return false

      const raw = match[1]
      if (raw === 'toc') return false // VitePress [[toc]] stays untouched

      const parts = raw.split('|')
      const target = parts[0].trim()
      const label = parts.length > 1 ? parts.slice(1).join('|') : target
      const key = target.replace(/^.*\//, '')
      const href = map.get(target) || map.get(target.toLowerCase()) || map.get(key) || map.get(key.toLowerCase())

      if (silent) return true

      const open = state.push('link_open', 'a', 1)
      if (href) {
        open.attrSet('href', href)
      } else {
        open.attrSet('href', '#' + encodeURIComponent(key))
        open.attrSet('class', 'wikilink-missing')
        open.attrSet('title', 'No page in this build: ' + target)
      }

      const text = state.push('text', '', 0)
      text.content = label
      state.push('link_close', 'a', -1)

      state.pos += match[0].length
      return true
    })
  }
}

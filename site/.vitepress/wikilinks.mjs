// Converts Tolaria [[wikilinks]] into real VitePress links.
// The vault is the source of truth: this plugin only rewrites rendered output,
// it never changes the Markdown files on disk.
//
// Because the site publishes only a curated subset, a link can point to a note
// that exists in the vault but is intentionally not on this site. Those render
// as a dimmed "not published" marker instead of a dead 404 link.

import fs from 'node:fs'
import path from 'node:path'
import { isPublished, REMOTE_BASE } from './publish-scope.mjs'

export function buildNoteMap(vaultRoot) {
  const published = new Map()
  const all = new Set()

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'site' || entry.name === 'node_modules') continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      if (!entry.name.endsWith('.md')) continue

      const stem = entry.name.slice(0, -3)
      const rel = path.relative(vaultRoot, full).split(path.sep).join('/')
      const route = '/' + rel.slice(0, -3)

      all.add(stem)
      all.add(stem.toLowerCase())
      all.add(rel)
      all.add(rel.toLowerCase())

      if (isPublished(rel)) {
        published.set(stem, route)
        published.set(stem.toLowerCase(), route)
        published.set(rel, route)
      }
    }
  }

  walk(vaultRoot)

  // Notes published by the companion site are listed in a committed manifest.
  const remoteFile = path.join(vaultRoot, '..', 'site', '.vitepress', 'remote-manifest.json')
  const remote = fs.existsSync(remoteFile)
    ? new Map(Object.entries(JSON.parse(fs.readFileSync(remoteFile, 'utf8'))))
    : new Map()

  return { published, all, remote }
}

export function wikilinkPlugin({ published, all, remote }) {
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

      const localHref = published.get(target) || published.get(target.toLowerCase())
        || published.get(key) || published.get(key.toLowerCase())
      const remoteRoute = remote.get(target) || remote.get(target.toLowerCase())
        || remote.get(key) || remote.get(key.toLowerCase())
      const isRemote = !localHref && !!remoteRoute
      const href = localHref || (remoteRoute ? REMOTE_BASE + remoteRoute : null)
      const exists = all.has(target) || all.has(target.toLowerCase())
        || all.has(key) || all.has(key.toLowerCase())

      if (silent) return true

      if (href) {
        const open = state.push('link_open', 'a', 1)
        open.attrSet('href', href)
        if (isRemote) {
          open.attrSet('target', '_blank')
          open.attrSet('rel', 'noopener')
          open.attrSet('class', 'wikilink-remote')
          open.attrSet('title', 'Opens the companion site')
        }
        const text = state.push('text', '', 0)
        text.content = label
        state.push('link_close', 'a', -1)
      } else if (exists) {
        // Note exists in the vault but is deliberately not on this site.
        const open = state.push('html_inline', '', 0)
        open.content = '<span class="wikilink-unpublished" title="Exists in the vault, not published on this site">'
        const text = state.push('text', '', 0)
        text.content = label
        const close = state.push('html_inline', '', 0)
        close.content = '</span>'
      } else {
        const open = state.push('link_open', 'a', 1)
        open.attrSet('href', '#' + encodeURIComponent(key))
        open.attrSet('class', 'wikilink-missing')
        open.attrSet('title', 'No such note in the vault: ' + target)
        const text = state.push('text', '', 0)
        text.content = label
        state.push('link_close', 'a', -1)
      }

      state.pos += match[0].length
      return true
    })
  }
}

// Make bare imports (vue, vue/server-renderer, ...) resolvable from notes in
// the vault. VitePress srcDir is <repo>/vault, but node_modules lives in
// <repo>/site/. A symlink keeps Node's normal resolution intact and preserves
// a single Vue instance — unlike aliasing 'vue' to a specific file.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../..')
const vaultRoot = path.join(repoRoot, 'vault')
const link = path.join(vaultRoot, 'node_modules')
const target = path.join(repoRoot, 'site', 'node_modules')

if (!fs.existsSync(target)) {
  console.error('site/node_modules missing — run npm install first')
  process.exit(1)
}

// Left over from the old layout, where the vault root was the repo root.
const stale = path.join(repoRoot, 'node_modules')
if (fs.existsSync(stale) || fs.lstatSync(stale, { throwIfNoEntry: false })) {
  try {
    fs.unlinkSync(stale)
  } catch {
    // Not a symlink or no permission — leave it alone.
  }
}

if (!fs.existsSync(link)) {
  fs.symlinkSync(path.join('..', 'site', 'node_modules'), link, 'dir')
  console.log('created node_modules symlink inside vault/')
}

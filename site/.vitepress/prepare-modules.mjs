// Make bare imports (vue, vue/server-renderer, ...) resolvable from notes in
// the vault root. VitePress srcDir is the vault, but node_modules lives in
// site/. A symlink keeps Node's normal resolution intact and preserves a
// single Vue instance — unlike aliasing 'vue' to a specific file.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const vaultRoot = path.resolve(here, '../..')
const link = path.join(vaultRoot, 'node_modules')
const target = path.join(vaultRoot, 'site', 'node_modules')

if (!fs.existsSync(target)) {
  console.error('site/node_modules missing — run npm install first')
  process.exit(1)
}

if (!fs.existsSync(link)) {
  fs.symlinkSync(path.join('site', 'node_modules'), link, 'dir')
  console.log('created node_modules symlink at vault root')
}

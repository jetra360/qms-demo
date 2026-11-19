// Make bare imports (vue, vue/server-renderer, ...) resolvable from notes in
// vault/. node_modules lives in site/, so put a symlink at the REPOSITORY ROOT
// — outside the Tolaria vault. Tolaria must never index package READMEs.
// One Vue instance is preserved; aliasing 'vue' to a file broke hydration.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../..')
const vaultLink = path.join(repoRoot, 'vault', 'node_modules')
const link = path.join(repoRoot, 'node_modules')
const target = path.join(repoRoot, 'site', 'node_modules')

if (!fs.existsSync(target)) {
  console.error('site/node_modules missing — run npm install first')
  process.exit(1)
}

// Old layout: remove any symlink inside the vault so Tolaria cannot see it.
try {
  if (fs.lstatSync(vaultLink).isSymbolicLink()) fs.unlinkSync(vaultLink)
} catch {
  // already absent
}

if (!fs.existsSync(link)) {
  fs.symlinkSync(path.join('site', 'node_modules'), link, 'dir')
  console.log('created node_modules symlink at repository root (outside vault)')
}

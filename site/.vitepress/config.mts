import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildNoteMap, wikilinkPlugin } from './wikilinks.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const vaultRoot = path.resolve(here, '../..')
const sidebar = JSON.parse(fs.readFileSync(path.join(here, 'sidebar.json'), 'utf8'))

export default defineConfig({
  title: 'Tolaria QMS',
  description: 'Quality Management System — the demo vault published as a searchable site',
  base: '/qms-demo/',
  srcDir: '..',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guides/00-start-here' },
      { text: 'Policies', link: '/policies/POL-QUAL-001' },
      { text: 'Registers', link: '/registers/document-master.sheet' },
      { text: 'ISO 9001', link: '/iso-9001/iso-9001-map' },
    ],
    sidebar,
    search: { provider: 'local' },
    outline: [2, 3],
    editLink: false,
    lastUpdated: false,
  },

  markdown: {
    config: (md) => {
      md.use(wikilinkPlugin(buildNoteMap(vaultRoot)))
    },
  },

  // srcDir points outside site/, so Vite cannot find vue/server-renderer
  // by walking up from a note in the vault root. Give it an explicit path.
  vite: {
    resolve: {
      alias: [
        { find: 'vue/server-renderer', replacement: path.resolve(here, '../node_modules/vue/server-renderer/index.mjs') },
        { find: /^vue$/, replacement: path.resolve(here, '../node_modules/vue/index.mjs') },
      ],
    },
  },
})

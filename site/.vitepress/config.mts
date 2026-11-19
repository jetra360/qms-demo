import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildNoteMap, wikilinkPlugin } from './wikilinks.mjs'
import { buildExcludes } from './publish-scope.mjs'
import { mermaidPlugin } from './mermaid.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const vaultRoot = path.resolve(here, '../../vault')
const sidebar = JSON.parse(fs.readFileSync(path.join(here, 'sidebar.json'), 'utf8'))
const srcExclude = buildExcludes(vaultRoot, fs)

export default defineConfig({
  title: 'QMS_demo',
  description: 'Guides from the QMS_demo vault',
  base: '/qms-demo/',
  srcDir: '../vault',
  // Apply the saved sidebar preference before paint, so returning readers do
  // not see the navigation flash before it is hidden.
  head: [
    ['script', {}, "try{if(localStorage.getItem('qms-sidebar-hidden')==='1')document.documentElement.classList.add('hide-sidebar')}catch(e){}"],
  ],
  // Curated site: every vault note still exists, but only guides/
  // (plus the homepage) are rendered and searchable.
  srcExclude,

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guides/00-start-here' },
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
      md.use(mermaidPlugin)
    },
  },

  // node_modules is symlinked at the repository root (outside the Tolaria
  // vault). resolve.modules finds bare imports from notes; only the subpath
  // vue/server-renderer needs an explicit file. Never alias 'vue' itself —
  // a second Vue instance broke hydration in the first build.
  vite: {
    resolve: {
      modules: [path.resolve(here, '../../node_modules'), 'node_modules'],
      alias: [
        {
          find: 'vue/server-renderer',
          replacement: path.resolve(here, '../../node_modules/vue/server-renderer/index.mjs'),
        },
      ],
    },
  },
})

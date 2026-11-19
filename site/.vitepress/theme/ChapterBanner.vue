<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import sidebar from '../sidebar.json'

const route = useRoute()

const guides = sidebar['/'].find((g) => g.text === 'Guides')?.items || []
const chapters = guides.filter((i) => i.items && i.items.length)

function flatten(items, out = []) {
  for (const item of items) {
    out.push(item)
    if (item.items) flatten(item.items, out)
  }
  return out
}
const allPages = flatten(guides)

const path = computed(() =>
  String(route.path).replace(/^\/qms-demo/, '').replace(/\.html$/, ''),
)
const chapterNum = computed(() => (path.value.match(/\/guides\/(\d{2})-/) || [])[1])
const numOf = (link) => (link.match(/\/guides\/(\d{2})-/) || [])[1]
const chapter = computed(() => chapters.find((c) => numOf(c.link) === chapterNum.value))
const isHome = computed(() => path.value === '/' || path.value === '')

// Reading position — the last guide page visited, remembered across sessions.
const lastLink = ref('')
watch(path, () => {
  if (typeof window === 'undefined') return
  lastLink.value = window.localStorage.getItem('qms-last-guide') || ''
}, { immediate: true })
const lastPage = computed(() => allPages.find((p) => p.link === lastLink.value))

function encode(source) {
  const bytes = new TextEncoder().encode(source)
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('')
  return typeof btoa === 'function'
    ? btoa(binary)
    : Buffer.from(binary, 'binary').toString('base64')
}

const diagram = computed(() => {
  if (!chapter.value) return ''
  const clean = (s) => s.replace(/"/g, "'")
  const lines = ['flowchart LR', `  C["${clean(chapter.value.text)}"]`]
  chapter.value.items.forEach((section, i) => {
    lines.push(`  C --> S${i}["${clean(section.text)}"]`)
    ;(section.items || []).forEach((leaf, j) => {
      lines.push(`  S${i} --> D${i}_${j}["${clean(leaf.text)}"]`)
    })
  })
  return lines.join('\n')
})
const encodedDiagram = computed(() => (diagram.value ? encode(diagram.value) : ''))
</script>

<template>
  <div v-if="chapter" class="chapter-banner">
    <div class="chapter-banner__head">
      <span class="chapter-banner__num">{{ chapterNum }}</span>
      <div>
        <p class="chapter-banner__kicker">Guided pathway {{ chapters.indexOf(chapter) + 1 }} of {{ chapters.length }}</p>
        <h2 class="chapter-banner__title">{{ chapter.text }}</h2>
      </div>
    </div>
    <div class="chapter-banner__body">
      <div class="chapter-banner__map">
        <div class="mermaid chapter-banner__diagram" data-mermaid :data-source="encodedDiagram"></div>
      </div>
      <div class="chapter-banner__list">
        <p class="chapter-banner__list-title">In this chapter</p>
        <ul>
          <li v-for="section in chapter.items" :key="section.link">
            <a :href="withBase(section.link)">{{ section.text }}</a>
            <ul v-if="section.items">
              <li v-for="leaf in section.items" :key="leaf.link">
                <a :href="withBase(leaf.link)">{{ leaf.text }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <a v-else-if="isHome && lastPage" class="continue-reading" :href="withBase(lastPage.link)">
    <span class="continue-reading__label">Continue where you left off</span>
    <span class="continue-reading__title">{{ lastPage.text }}</span>
    <span class="continue-reading__arrow" aria-hidden="true">→</span>
  </a>
</template>

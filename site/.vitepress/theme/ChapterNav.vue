<script setup>
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import sidebar from '../sidebar.json'

const route = useRoute()
const guides = sidebar['/'].find((g) => g.text === 'Guides')?.items || []
const chapters = guides.filter((i) => i.items && i.items.length)

const numOf = (link) => (link.match(/\/guides\/(\d{2})-/) || [])[1]
const currentNum = computed(() =>
  (String(route.path).match(/\/guides\/(\d{2})-/) || [])[1],
)
const index = computed(() => chapters.findIndex((c) => numOf(c.link) === currentNum.value))
const prev = computed(() => (index.value > 0 ? chapters[index.value - 1] : null))
const next = computed(() =>
  index.value >= 0 && index.value < chapters.length - 1 ? chapters[index.value + 1] : null,
)
</script>

<template>
  <nav v-if="index >= 0" class="chapter-nav" aria-label="Chapter navigation">
    <a v-if="prev" class="chapter-nav__link" :href="withBase(prev.link)">
      <span class="chapter-nav__hint">← Previous chapter</span>
      <span class="chapter-nav__title">{{ prev.text }}</span>
    </a>
    <span v-else class="chapter-nav__spacer"></span>
    <a v-if="next" class="chapter-nav__link chapter-nav__link--next" :href="withBase(next.link)">
      <span class="chapter-nav__hint">Next chapter →</span>
      <span class="chapter-nav__title">{{ next.text }}</span>
    </a>
  </nav>
</template>

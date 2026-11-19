<script setup>
import { onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const sources = new WeakMap()
let stopWatch = () => {}
let stopThemeWatch = () => {}
let running = false

function nordConfig(dark) {
  return {
    startOnLoad: false,
    securityLevel: 'loose',
    theme: 'base',
    themeVariables: {
      darkMode: dark,
      background: dark ? '#3B4252' : '#ECEFF4',
      primaryColor: dark ? '#434C5E' : '#E5E9F0',
      primaryTextColor: dark ? '#ECEFF4' : '#2E3440',
      primaryBorderColor: '#5E81AC',
      secondaryColor: dark ? '#4C566A' : '#D8DEE9',
      tertiaryColor: dark ? '#3B4252' : '#ECEFF4',
      lineColor: dark ? '#88C0D0' : '#4C566A',
      textColor: dark ? '#ECEFF4' : '#2E3440',
      mainBkg: dark ? '#434C5E' : '#E5E9F0',
      nodeBorder: '#5E81AC',
      clusterBkg: dark ? '#3B4252' : '#ECEFF4',
      clusterBorder: '#81A1C1',
      titleColor: dark ? '#88C0D0' : '#5E81AC',
      edgeLabelBackground: dark ? '#3B4252' : '#ECEFF4',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSize: '14px',
    },
    flowchart: { curve: 'basis', htmlLabels: true, useMaxWidth: true },
    sequence: { useMaxWidth: true },
  }
}

async function render() {
  if (running) return
  const nodes = [...document.querySelectorAll('.mermaid[data-mermaid]')]
  if (!nodes.length) return
  running = true
  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize(nordConfig(document.documentElement.classList.contains('dark')))
    for (const node of nodes) {
      // Decode the source carried from the build; literal newlines in raw HTML
      // are collapsed by VitePress, which Mermaid cannot parse.
      if (!sources.has(node)) {
        const encoded = node.getAttribute('data-source') || ''
        const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))
        sources.set(node, new TextDecoder().decode(bytes))
      }
      node.textContent = sources.get(node)
      node.removeAttribute('data-processed')
      try {
        await mermaid.run({ nodes: [node] })
      } catch (err) {
        node.classList.add('mermaid-failed')
        console.warn('[mermaid] could not render diagram:', err?.message || String(err), err?.stack?.slice(0, 500) || '')
      }
    }
  } finally {
    running = false
  }
}

function schedule() {
  nextTick(render)
}

function savePosition(p) {
  if (typeof window === 'undefined') return
  const normalized = String(p).replace(/^\/qms-demo/, '').replace(/\.html$/, '')
  if (/^\/guides\/\d{2}-/.test(normalized)) {
    window.localStorage.setItem('qms-last-guide', normalized)
  }
}

onMounted(() => {
  schedule()
  stopWatch = watch(() => route.path, (p) => {
    savePosition(p)
    schedule()
  }, { immediate: true })

  // Redraw when the reader switches between light and dark mode.
  const html = document.documentElement
  stopThemeWatch = () => htmlObserver.disconnect()
  const htmlObserver = new MutationObserver(schedule)
  htmlObserver.observe(html, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  stopWatch()
  stopThemeWatch()
})
</script>

<template><span class="mermaid-mount" aria-hidden="true"></span></template>

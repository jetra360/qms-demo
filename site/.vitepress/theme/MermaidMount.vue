<script setup>
import { onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
let stopWatch = () => {}
let stopThemeWatch = () => {}
let stopContentWatch = () => {}
let running = false
let pending = false
let lastDark = null

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

// The source travels in a base64 attribute: VitePress collapses literal
// newlines in raw HTML, which Mermaid cannot parse.
function sourceOf(node) {
  const encoded = node.getAttribute('data-source') || ''
  try {
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return node.textContent.trim()
  }
}

async function render() {
  if (running) {
    pending = true
    return
  }
  const nodes = [...document.querySelectorAll('.mermaid[data-mermaid]')]
  if (!nodes.length) return

  const dark = document.documentElement.classList.contains('dark')
  // A theme switch is the only reason to redraw an already-rendered diagram.
  const force = lastDark !== null && lastDark !== dark
  lastDark = dark

  // Skip diagrams that are already on screen and still valid. This also means
  // a render triggered too early during navigation simply does nothing until
  // the content observer sees the new (unrendered) containers.
  const todo = nodes.filter((n) => force || !n.querySelector('svg'))
  if (!todo.length) return

  running = true
  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize(nordConfig(dark))
    for (const node of todo) {
      node.classList.remove('mermaid-ready')
      node.textContent = sourceOf(node)
      node.removeAttribute('data-processed')
      try {
        await mermaid.run({ nodes: [node] })
        node.classList.add('mermaid-ready')
        addExpandButton(node)
      } catch (err) {
        // Mermaid can throw a harmless animation error after it has already
        // drawn the SVG. Treat a visible diagram as ready either way.
        if (node.querySelector('svg')) {
          node.classList.add('mermaid-ready')
          addExpandButton(node)
        } else {
          node.classList.add('mermaid-failed')
        }
        console.warn('[mermaid] could not render diagram:', err?.message || String(err))
      }
    }
  } finally {
    running = false
    if (pending) {
      pending = false
      schedule()
    }
  }
}

function addExpandButton(node) {
  if (node.querySelector('.mermaid-expand')) return
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'mermaid-expand'
  button.textContent = '⤢ Expand overview'
  button.setAttribute('aria-label', 'Expand diagram to a larger view')
  button.addEventListener('click', () => openOverlay(node))
  node.prepend(button)
}

// Use the nearest heading as the overlay title, and the diagram's own
// viewBox width as the starting size so small diagrams are not blown up.
function titleFor(node) {
  let el = node.previousElementSibling
  while (el) {
    if (/^H[1-4]$/.test(el.tagName)) return el.textContent.trim()
    el = el.previousElementSibling
  }
  return 'Diagram overview'
}

function baseWidth(svg) {
  const viewBox = (svg.getAttribute('viewBox') || '').trim().split(/\s+/)
  const width = Number(viewBox[2]) || 1200
  return Math.max(900, Math.min(1600, Math.round(width)))
}

function closeOverlay() {
  const old = document.querySelector('.mermaid-overlay')
  if (old) {
    if (old._onKey) document.removeEventListener('keydown', old._onKey)
    old.remove()
  }
  document.body.style.overflow = ''
}

function openOverlay(node) {
  const svg = node.querySelector('svg')
  if (!svg) return
  closeOverlay()

  const overlay = document.createElement('div')
  overlay.className = 'mermaid-overlay'
  overlay.innerHTML = `
    <div class="mermaid-overlay__bar">
      <span class="mermaid-overlay__title"></span>
      <div class="mermaid-overlay__tools">
        <button type="button" data-act="out" aria-label="Zoom out">−</button>
        <button type="button" data-act="in" aria-label="Zoom in">+</button>
        <button type="button" data-act="close">Close</button>
      </div>
    </div>
    <div class="mermaid-overlay__body"></div>`
  const name = titleFor(node)
  overlay.querySelector('.mermaid-overlay__title').textContent =
    name === 'Diagram overview' ? name : `${name} — overview`

  const clone = svg.cloneNode(true)
  clone.removeAttribute('id')
  clone.style.maxWidth = 'none'
  overlay.querySelector('.mermaid-overlay__body').appendChild(clone)
  document.body.appendChild(overlay)
  document.body.style.overflow = 'hidden'

  const base = baseWidth(svg)
  let zoom = 1
  const apply = () => { clone.style.width = `${Math.round(base * zoom)}px` }
  apply()

  overlay.addEventListener('click', (event) => {
    const act = event.target?.dataset?.act
    if (act === 'in') { zoom = Math.min(zoom + 0.2, 3); apply() }
    else if (act === 'out') { zoom = Math.max(zoom - 0.2, 0.5); apply() }
    else if (act === 'close' || event.target === overlay) closeOverlay()
  })
  overlay._onKey = (event) => {
    if (event.key === 'Escape') closeOverlay()
  }
  document.addEventListener('keydown', overlay._onKey)
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

function hasUnrendered() {
  return [...document.querySelectorAll('.mermaid[data-mermaid]')].some(
    (n) => !n.querySelector('svg') && !n.classList.contains('mermaid-failed'),
  )
}

onMounted(() => {
  schedule()
  stopWatch = watch(() => route.path, (p) => {
    savePosition(p)
    schedule()
  }, { immediate: true })

  // Redraw on light/dark switch.
  const html = document.documentElement
  const htmlObserver = new MutationObserver(schedule)
  htmlObserver.observe(html, { attributes: true, attributeFilter: ['class'] })
  stopThemeWatch = () => htmlObserver.disconnect()

  // VitePress swaps the page content asynchronously after a route change, so
  // a nextTick is not always enough. Watch for newly inserted containers.
  const contentObserver = new MutationObserver(() => {
    if (!running && hasUnrendered()) schedule()
  })
  contentObserver.observe(document.body, { childList: true, subtree: true })
  stopContentWatch = () => contentObserver.disconnect()
})

onUnmounted(() => {
  stopWatch()
  stopThemeWatch()
  stopContentWatch()
})
</script>

<template><span class="mermaid-mount" aria-hidden="true"></span></template>

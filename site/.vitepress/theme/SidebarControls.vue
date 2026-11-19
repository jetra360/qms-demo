<script setup>
import { nextTick } from 'vue'

// VitePress keeps each sidebar section's open state on its own item, so the
// simplest reliable control is to click the carets. Works in the mobile drawer
// too, because it operates on whatever is currently in the DOM.
async function setAll(open) {
  await nextTick()
  document.querySelectorAll('.VPSidebar .VPSidebarItem.collapsible').forEach((item) => {
    const collapsed = item.classList.contains('collapsed')
    if (open === collapsed) item.querySelector('.caret')?.click()
  })
}
</script>

<template>
  <div class="sidebar-controls">
    <span class="sidebar-controls__label">Chapter outline</span>
    <div class="sidebar-controls__buttons">
      <button type="button" @click="setAll(true)">Expand all</button>
      <button type="button" @click="setAll(false)">Collapse all</button>
    </div>
  </div>
</template>

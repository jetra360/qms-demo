<script setup>
import { onMounted, ref } from 'vue'

const hidden = ref(false)
const KEY = 'qms-sidebar-hidden'

function apply(value) {
  hidden.value = value
  document.documentElement.classList.toggle('hide-sidebar', value)
  try {
    window.localStorage.setItem(KEY, value ? '1' : '0')
  } catch {
    // Private browsing can block storage; the toggle still works this session.
  }
}

onMounted(() => {
  try {
    hidden.value = window.localStorage.getItem(KEY) === '1'
  } catch {
    hidden.value = false
  }
  document.documentElement.classList.toggle('hide-sidebar', hidden.value)
})
</script>

<template>
  <button
    class="sidebar-toggle"
    type="button"
    :title="hidden ? 'Show navigation' : 'Hide navigation'"
    :aria-label="hidden ? 'Show navigation' : 'Hide navigation'"
    @click="apply(!hidden)"
  >
    <span class="sidebar-toggle__icon" aria-hidden="true">{{ hidden ? '☰' : '×' }}</span>
    <span class="sidebar-toggle__label">{{ hidden ? 'Show navigation' : 'Hide navigation' }}</span>
  </button>
</template>

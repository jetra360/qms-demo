import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import MermaidMount from './MermaidMount.vue'
import './custom.css'

// A plain extension of the default theme. No Vue aliasing — that caused the
// hydration failure recorded in lessons-learned.md.
export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-top': () => h(MermaidMount),
  }),
}

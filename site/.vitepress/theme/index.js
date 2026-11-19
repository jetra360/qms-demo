import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import MermaidMount from './MermaidMount.vue'
import ChapterBanner from './ChapterBanner.vue'
import ChapterNav from './ChapterNav.vue'
import SidebarControls from './SidebarControls.vue'
import './custom.css'

// A plain extension of the default theme. No Vue aliasing — that caused the
// hydration failure recorded in lessons-learned.md.
export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-top': () => h(MermaidMount),
    'doc-before': () => h(ChapterBanner),
    'doc-after': () => h(ChapterNav),
    'sidebar-nav-before': () => h(SidebarControls),
  }),
}

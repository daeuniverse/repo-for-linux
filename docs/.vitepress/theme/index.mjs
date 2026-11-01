import { h } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './brand.css'

// Choosing a tab in one code group (OpenWrt or ImmortalWrt, dae or honk, sudo or root)
// chooses the same tab in every other group on the page, as the feed site's switches do.
function syncCodeGroups(event) {
  const input = event.target
  if (!(input instanceof HTMLInputElement) || !input.closest('.vp-code-group')) return
  const title = input.labels?.[0]?.dataset.title
  if (!title) return
  for (const label of document.querySelectorAll(`.vp-code-group label[data-title="${CSS.escape(title)}"]`)) {
    const other = label.control
    if (other && other !== input && !other.checked) other.click()
  }
}

// The landing page of dae, honk and doona names the version this build publishes.
const ProjectVersion = {
  setup() {
    const { page, theme } = useData()
    return () => {
      const project = page.value.relativePath.match(/^(?:zh-(?:CN|TW)\/)?(dae|honk|doona)\/index\.md$/)?.[1]
      const { label, versions } = theme.value.projectVersion || {}
      const version = project && versions?.[project]
      return version ? h('p', { class: 'project-version' }, label.replace('{version}', `v${version}`)) : null
    }
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(ProjectVersion) }),
  enhanceApp() {
    if (typeof document !== 'undefined') document.addEventListener('change', syncCodeGroups)
  }
}

import { defineConfig } from 'vitepress'
import { locales } from './locales.mjs'
import upstream from './upstream.json' with { type: 'json' }
import fetched from './generated/fetched-docs.json' with { type: 'json' }
import versions from './generated/versions.json' with { type: 'json' }

export const doonaGroups = {
  start: ['index', 'quick-start', 'editions', 'requirements'],
  install: ['install-debian', 'install-fedora', 'install-arch', 'install-gentoo', 'install-openwrt', 'install-manual', 'install', 'minimal-configuration', 'service-management'],
  standard: ['tutorial', 'first-sign-in', 'tour', 'observe', 'routing', 'config-and-settings', 'common-tasks', 'features'],
  lite: ['lite', 'lite-connect', 'lite-tasks'],
  reference: ['configuration', 'what-doona-can-change', 'feature-requirements', 'troubleshooting', 'development']
}

const doonaLabels = {
  'en-US': {start: 'Getting started', install: 'Install and first run', standard: 'Standard edition', lite: 'doona lite', reference: 'Reference'},
  'zh-CN': {start: '入门', install: '安装与首次运行', standard: '标准版', lite: 'doona lite', reference: '参考'},
  'zh-TW': {start: '入門', install: '安裝與首次執行', standard: '標準版', lite: 'doona lite', reference: '參考'}
}

const organizationUrl = 'https://github.com/daeuniverse'
// Edit links resolve inside this repository; the footer and the social link address the
// organization, which is what a reader following "GitHub" is looking for.
const repositoryUrl = `${organizationUrl}/repo-for-linux`
const base = process.env.DOCS_BASE || '/'

function pageLocale(relativePath) {
  return Object.values(locales).find(locale => locale.prefix &&
    (relativePath.startsWith(locale.prefix.slice(1) + '/') || relativePath.startsWith(`dae/${locale.lang}/`) || relativePath.startsWith(`daed/${locale.lang}/`) || relativePath.startsWith(`honk/${locale.lang}/`) || relativePath.startsWith(`doona/${locale.lang}/`) || relativePath.startsWith(`openwrt/${locale.lang}/`))) || locales.root
}

// dae, honk and doona have their own manuals here, so each is a nav item of its own;
// OpenWrt, every other package the repository published this build, kdae and DaedNext
// share one menu. Versions appear on the project pages, not in the navigation.
const packageLinks = { daed: '/daed/' }
const ownButtons = ['dae', 'honk', 'doona']
function versionMenu(prefix, t) {
  const others = Object.keys(versions).filter(name => !ownButtons.includes(name))
  return [
    ...ownButtons.map(name => ({ text: name, link: `${prefix}/${name}/` })),
    { text: t.more, items: [
      { items: [{ text: t.openwrt, link: `${prefix}/openwrt/` }] },
      { text: t.otherSoftware, items: others.map(name => ({
        text: name,
        link: `${prefix}${packageLinks[name] || '/guide/packages'}`
      })) },
      { text: t.experimental, items: [
        { text: 'kdae', link: `${prefix}/kdae` },
        { text: 'DaedNext', link: `${prefix}/daednext` }
      ] }
    ] }
  ]
}

function localeConfig({ lang, label, prefix, description, labels: t, theme }) {
  const pages = upstream.entries.filter(entry => entry.locale === lang)
  const manualItems = section => pages
    .filter(entry => section ? entry.topic.startsWith(`${section}/`) : !entry.topic.includes('/'))
    .map(entry => ({ text: entry.title, link: `${prefix}/dae/${entry.path.split('/').slice(2).join('/').replace(/\.md$/, '').replace(/^index$/, '').replace(/\/index$/, '/')}` }))
  const installation = {
    text: t.installation, link: `${prefix}/dae/installation/`,
    items: [
      { text: 'Arch Linux / Manjaro', link: `${prefix}/dae/installation/arch` },
      { text: t.debian, link: `${prefix}/dae/installation/debian` },
      { text: t.fedora, link: `${prefix}/dae/installation/fedora` },
      { text: t.opensuse, link: `${prefix}/dae/installation/opensuse` },
      { text: t.gentoo, link: `${prefix}/dae/installation/gentoo` },
      { text: 'Nix / NixOS', link: `${prefix}/dae/installation/nix` },
      { text: 'Docker', link: `${prefix}/dae/installation/docker` },
      { text: 'OpenWrt', link: `${prefix}/openwrt/` },
      ...manualItems('tutorials'),
      { text: t.manualInstall, link: `${prefix}/dae/installation/manual-installation` },
      ...manualItems('user-guide').filter(item => item.link === `${prefix}/dae/user-guide/run-as-daemon`)
    ]
  }
  const doona = { text: 'doona', link: `${prefix}/doona/`, items:
    Object.entries(doonaGroups).map(([section, topics]) => ({
      text: doonaLabels[lang][section],
      // The groups a newcomer needs, including the OpenWrt install page, cannot be folded.
      ...(['start', 'install'].includes(section) ? {} : { collapsed: true }),
      items: topics.filter(topic => topic !== 'index').map(topic => {
        const entry = fetched.entries.find(entry => entry.project === 'doona' && entry.locale === lang && entry.topic === `${topic}.md`)
        if (!entry) throw new Error(`Missing doona page: ${lang}/${topic}`)
        // honk's OpenWrt package embeds doona, so the router install is the feed guide.
        if (topic === 'install-openwrt') return { text: entry.title, link: `${prefix}/openwrt/` }
        return { text: entry.title, link: `${prefix}/doona/${topic === 'index' ? '' : topic}` }
      })
    }))
  }
  // Short labels for the feed site's three guide pages; their headings stay the page titles.
  const openwrtLabels = { 'index.md': t.openwrtInstall, 'mirror.md': t.openwrtMirror, 'thanks.md': t.openwrtThanks }
  const openwrt = { text: t.openwrt, link: `${prefix}/openwrt/`, items:
    fetched.entries.filter(entry => entry.project === 'openwrt' && entry.locale === lang)
      .map(entry => ({ text: openwrtLabels[entry.topic] || entry.title, link: `${prefix}/openwrt/${entry.topic === 'index.md' ? '' : entry.topic.replace(/\.md$/, '')}` }))
      .concat({ text: t.fileBrowser, link: 'https://openwrt.daeuniverse.org/files/' })
  }

  // Everything that is not dae, honk or doona shares one sidebar.
  const other = [
    { text: t.otherSoftware, collapsed: false, items: [
      { text: t.packageList, link: `${prefix}/guide/packages` },
      { text: t.debian, link: `${prefix}/guide/packages/debian` },
      { text: t.fedora, link: `${prefix}/guide/packages/fedora` },
      { text: t.opensuse, link: `${prefix}/guide/packages/opensuse` },
      { text: t.gentoo, link: `${prefix}/guide/packages/gentoo` },
      { text: 'Arch Linux / Manjaro', link: `${prefix}/guide/packages/arch` }
    ] },
    { text: t.daedArchived, collapsed: false, items: [
      { text: 'daed', link: `${prefix}/daed/` },
      { text: 'Arch Linux / Manjaro', link: `${prefix}/daed/installation/arch` },
      { text: t.debian, link: `${prefix}/daed/installation/debian` },
      { text: t.fedora, link: `${prefix}/daed/installation/fedora` },
      { text: t.opensuse, link: `${prefix}/daed/installation/opensuse` },
      { text: t.gentoo, link: `${prefix}/daed/installation/gentoo` },
      { text: 'Nix / NixOS', link: `${prefix}/daed/installation/nix` },
      { text: t.serviceManagement, link: `${prefix}/daed/service-management` }
    ] },
    { text: t.experimental, collapsed: false, items: [
      { text: 'kdae', link: `${prefix}/kdae` },
      { text: 'DaedNext', link: `${prefix}/daednext` }
    ] },
    { text: t.reference, items: [
      { text: t.services, link: `${prefix}/guide/maintenance` }
    ] }
  ]
  return {
    lang, label, description,
    link: `${prefix}/`,
    themeConfig: {
      ...theme,
      projectVersion: {
        label: t.currentVersion,
        versions: Object.fromEntries(ownButtons.filter(name => versions[name]).map(name => [name, versions[name]]))
      },
      editLink: { text: t.edit, pattern: process.env.DOCS_EDIT_URL || `${repositoryUrl}/edit/main/docs/:path` },
      nav: [
        ...versionMenu(prefix, t)
      ],
      // Each project gets its own sidebar, so a reader inside one manual sees only that
      // manual; the nav buttons switch between them.
      sidebar: {
        [`${prefix}/dae/`]: [
          {
            text: pages.find(entry => entry.topic === 'README.md').title,
            link: `${prefix}/dae/`,
            items: [
              { text: t.requirements, link: `${prefix}/dae/start/requirements` },
              installation,
              { text: t.minimalConfiguration, link: `${prefix}/dae/start/minimal-configuration` },
              { text: t.serviceManagement, link: `${prefix}/dae/start/service-management` },
              { text: t.dnsAndPrivateAddresses, link: `${prefix}/dae/start/dns-and-private-addresses` },
              { text: t.pppoe, link: `${prefix}/dae/start/pppoe` }
            ]
          },
          { text: t.concepts, collapsed: true, items: manualItems('').filter(item =>
            item.link !== `${prefix}/dae/` && item.link !== `${prefix}/dae/troubleshooting`) },
          { text: t.userGuide, collapsed: true, items: [
            ...manualItems('user-guide').filter(item => item.link !== `${prefix}/dae/user-guide/run-as-daemon`),
            ...manualItems('').filter(item => item.link === `${prefix}/dae/troubleshooting`)
          ] },
          { text: t.configuration, collapsed: true, items: manualItems('configuration') },
          { text: t.development, collapsed: true, items: manualItems('development') }
        ],
        [`${prefix}/honk/`]: [
          { text: t.installation, link: `${prefix}/honk/installation/`, items: [
            { text: 'Arch Linux / Manjaro', link: `${prefix}/honk/installation/arch` },
            { text: t.debian, link: `${prefix}/honk/installation/debian` },
            { text: t.fedora, link: `${prefix}/honk/installation/fedora` },
            { text: t.opensuse, link: `${prefix}/honk/installation/opensuse` },
            { text: t.firstRun, link: `${prefix}/honk/installation/first-run` },
            { text: 'Docker', link: `${prefix}/honk/installation/docker` },
            { text: 'OpenWrt', link: `${prefix}/openwrt/` }
          ] },
          ...['', 'design', 'operations', 'reference'].map(section => ({
            text: section ? t[section] : t.overview,
            // The overview group's heading opens the landing page, which has no item of its own.
            ...(section ? {} : { link: `${prefix}/honk/` }),
            collapsed: true,
            items: fetched.entries.filter(entry => entry.project === 'honk' && entry.locale === lang &&
              (section ? entry.topic.startsWith(`${section}/`) : !entry.topic.includes('/')))
              .map(entry => ({ text: entry.title, link: `${prefix}/honk/${entry.topic.replace(/\.md$/, '')}` }))
          }))
        ],
        [`${prefix}/doona/`]: [doona],
        [`${prefix}/openwrt/`]: [openwrt],
        ...Object.fromEntries(['/daed/', '/guide/', '/kdae', '/daednext'].map(path => [`${prefix}${path}`, other]))
      },
      outline: { level: [2, 3], label: t.outline },
      docFooter: { prev: t.previous, next: t.next }
    }
  }
}

export default defineConfig({
  title: 'Dae Universe',
  lastUpdated: true,
  base,
  head: [['link', { rel: 'icon', type: 'image/png', href: `${base}daeuniverse-favicon.png` }]],
  cleanUrls: process.env.DOCS_CLEAN_URLS !== 'false',
  appearance: true,
  srcExclude: ['DESIGN.md'],
  rewrites: {
    'openwrt/en-US/:rest*': 'openwrt/:rest*',
    'openwrt/zh-CN/:rest*': 'zh-CN/openwrt/:rest*',
    'openwrt/zh-TW/:rest*': 'zh-TW/openwrt/:rest*',
    'doona/en-US/:rest*': 'doona/:rest*',
    'doona/zh-CN/:rest*': 'zh-CN/doona/:rest*',
    'doona/zh-TW/:rest*': 'zh-TW/doona/:rest*',
    'honk/en-US/:rest*': 'honk/:rest*',
    'honk/zh-CN/:rest*': 'zh-CN/honk/:rest*',
    'honk/zh-TW/:rest*': 'zh-TW/honk/:rest*',
    'daed/en-US/:rest*': 'daed/:rest*',
    'daed/zh-CN/:rest*': 'zh-CN/daed/:rest*',
    'daed/zh-TW/:rest*': 'zh-TW/daed/:rest*',
    'dae/en-US/:rest*': 'dae/:rest*',
    'dae/zh-CN/:rest*': 'zh-CN/dae/:rest*',
    'dae/zh-TW/:rest*': 'zh-TW/dae/:rest*'
  },
  outDir: process.env.DOCS_OUT_DIR || './.vitepress/dist',
  cacheDir: process.env.DOCS_CACHE_DIR || './.vitepress/cache',
  sitemap: { hostname: process.env.DOCS_SITE_URL || 'https://daeuniverse.org' },
  locales: Object.fromEntries(Object.entries(locales).map(([key, locale]) => [key, localeConfig(locale)])),
  markdown: {
    config(md) {
      const fence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, index, options, env, renderer) => {
        const title = md.utils.escapeHtml(pageLocale(env.relativePath || '').labels.copy)
        return fence(tokens, index, options, env, renderer).replace('title="Copy Code"', `title="${title}"`)
      }
      const linkOpen = md.renderer.rules.link_open
      md.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
        const html = linkOpen ? linkOpen(tokens, index, options, env, renderer) : renderer.renderToken(tokens, index, options)
        const label = md.utils.escapeHtml(pageLocale(env.relativePath || '').labels.permalink)
        return html.replace('aria-label="Permalink to ', `aria-label="${label} `)
      }
    }
  },
  transformHead({ pageData }) {
    const { copied } = pageLocale(pageData.relativePath).labels
    return [['style', {}, `:root { --vp-code-copy-copied-text-content: ${JSON.stringify(copied)}; }`]]
  },
  themeConfig: {
    siteTitle: 'Dae Universe',
    footer: { message: `<a href="${organizationUrl}">GitHub</a>` },
    logo: { src: '/daeuniverse.png', alt: 'Dae Universe' },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (text) => Array.from(new Intl.Segmenter('en', { granularity: 'word' }).segment(text))
              .filter(segment => segment.isWordLike).map(segment => segment.segment)
          }
        },
        locales: Object.fromEntries(Object.entries(locales)
          .filter(([, locale]) => locale.search)
          .map(([key, locale]) => [key, { translations: locale.search }]))
      }
    },
    socialLinks: [{ icon: 'github', link: organizationUrl }]
  }
})

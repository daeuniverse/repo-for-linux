import { test } from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile, readdir, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'
import { locales } from '../docs/.vitepress/locales.mjs'

// The doona manual is source in this repository: docs/doona/<locale>/*.md, images and anchors.json under docs/public/doona/.
const root = fileURLToPath(new URL('../', import.meta.url))
const manual = join(root, 'docs/doona')
const publicRoot = join(root, 'docs/public')
const langs = Object.values(locales).map(locale => locale.lang)
const { default: config, doonaGroups } = await import('../docs/.vitepress/config.mjs')
const topics = Object.values(doonaGroups).flat(2)
const anchors = JSON.parse(await readFile(join(publicRoot, 'doona/anchors.json'), 'utf8'))
const versions = JSON.parse(await readFile(join(root, 'docs/.vitepress/generated/versions.json'), 'utf8'))

const pagePath = (lang, topic) => join(manual, lang, `${topic}.md`)

// Headings outside code fences, with the id each carries, and the inline anchors (<a name> and <span id>, used in
// table cells) with the heading they sit under.
function parse(text) {
  let fence
  const headings = [], inline = []
  for (const line of text.split('\n')) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)
    if (marker) {
      if (!fence) fence = marker[1]
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = undefined
      continue
    }
    if (fence) continue
    const heading = line.match(/^(#{1,6}) (.+)$/)
    if (heading) {
      const id = heading[2].match(/^(.+) \{#([^}\s]+)\}$/)
      headings.push({ level: heading[1].length, text: id?.[1] ?? heading[2], id: id?.[2] })
    }
    // <a name> and <span id> name the same anchor for old and new browsers.
    for (const id of new Set([...line.matchAll(/<(?:a name|span id)="([^"]+)"/g)].map(match => match[1]))) inline.push({ id, section: headings.length - 1 })
  }
  return { headings, inline }
}

// The id the build gave a heading without an explicit anchor: its text, lower-cased, with a counter for repeats.
function defaultIds(list) {
  const seen = new Map()
  return list.map(({ level, text }) => {
    const base = text.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').replace(/[*_~]/g, '')
      .toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '').replace(/ /g, '-')
    let id = base
    while (seen.has(id)) {
      const count = seen.get(base) + 1
      seen.set(base, count)
      id = `${base}-${count}`
    }
    seen.set(id, 0)
    return level === 1 ? `title-${id}` : id
  })
}

const pages = new Map()
for (const lang of langs) {
  for (const topic of topics) {
    const text = await readFile(pagePath(lang, topic), 'utf8')
    const { headings: list, inline } = parse(text)
    const defaults = defaultIds(list)
    // The anchors written by hand: ids that differ from the heading's own, and every inline one.
    const explicit = [
      ...list.flatMap((heading, section) => heading.id && heading.id !== defaults[section] ? [{ id: heading.id, section }] : []),
      ...inline
    ]
    pages.set(`${lang}/${topic}`, { lang, topic, text, headings: list, defaults, explicit, ids: [...list.map(heading => heading.id), ...inline.map(anchor => anchor.id)] })
  }
}
const page = (lang, topic) => pages.get(`${lang}/${topic}`)

test('every locale has the same pages, and the sidebar lists each once in order with its H1 as the title', async () => {
  assert.equal(topics.length, 29)
  assert.equal(new Set(topics).size, topics.length)
  for (const lang of langs) {
    const files = (await readdir(join(manual, lang))).sort()
    assert.deepEqual(files, topics.map(topic => `${topic}.md`).sort(), lang)
  }
  for (const [key, locale] of Object.entries(locales)) {
    const manualSidebar = config.locales[key].themeConfig.sidebar[`${locale.prefix}/doona/`].find(item => item.text === 'doona')
    assert.equal(manualSidebar.link, `${locale.prefix}/doona/`)
    const items = list => list.flatMap(item => [item, ...items(item.items || [])])
    const entries = manualSidebar.items.flatMap(section => items(section.items))
    assert.deepEqual(entries.map(item => item.link), topics.filter(topic => topic !== 'index').map(topic =>
      topic === 'install-openwrt' ? `${locale.prefix}/openwrt/` : `${locale.prefix}/doona/${topic}`))
    for (const [index, topic] of topics.filter(topic => topic !== 'index').entries()) {
      assert.equal(entries[index].text, page(locale.lang, topic).headings[0].text, `${locale.lang}/${topic}`)
    }
  }
})

test('pages carry one H1, no doona-docs footer, and nothing left from the old language line or tab syntax', () => {
  for (const { lang, topic, text, headings: list } of pages.values()) {
    const where = `${lang}/${topic}`
    assert.equal(list.filter(heading => heading.level === 1).length, 1, where)
    assert.equal(list[0].level, 1, where)
    assert.ok(text.startsWith('---\neditLink: false\nlastUpdated: false\n---\n'), where)
    assert.ok(!/^keywords:/m.test(text), where)
    assert.ok(!/\]\(\.\.\/(?:en|zh-CN|zh-TW)\//.test(text), where)
    assert.ok(!text.includes('tab="'), where)
    assert.ok(!/^(?:Source:|来源：|來源：) \[doona-docs\]/m.test(text), where)
    assert.ok(!text.includes('本頁暫以簡體中文顯示'), where)
  }
})

test('locales share heading levels and ids are unique within a page', () => {
  for (const topic of topics) {
    const reference = page('en-US', topic)
    for (const lang of langs) {
      const current = page(lang, topic)
      const where = `${lang}/${topic}`
      assert.deepEqual(current.headings.map(heading => heading.level), reference.headings.map(heading => heading.level), where)
      assert.ok(current.headings.every(heading => heading.id), `${where}: a heading has no {#id}`)
      assert.equal(new Set(current.ids).size, current.ids.length, `${where}: duplicate ids`)
    }
  }
})

test('anchors.json lists exactly the explicit anchors, each on its page and under the same heading in every locale', () => {
  const listed = new Map(topics.map(topic => [topic, new Set()]))
  for (const [anchor, topic] of Object.entries(anchors)) {
    assert.ok(listed.has(topic), `${anchor}: ${topic} is not a page`)
    listed.get(topic).add(anchor)
  }
  for (const topic of topics) {
    for (const anchor of listed.get(topic)) {
      const sections = langs.map(lang => {
        const found = page(lang, topic).ids.includes(anchor)
        assert.ok(found, `${lang}/${topic}: {#${anchor}} is listed in anchors.json but missing`)
        // A heading's id sits in its own section; an inline anchor in the section it is under.
        const { headings: list, explicit } = page(lang, topic)
        return (explicit.find(entry => entry.id === anchor) ?? { section: list.findIndex(heading => heading.id === anchor) }).section
      })
      assert.equal(new Set(sections).size, 1, `${topic}: ${anchor} is under a different heading in some locale`)
    }
    for (const lang of langs) {
      for (const { id } of page(lang, topic).explicit) assert.ok(listed.get(topic).has(id), `${lang}/${topic}: ${id} is not in anchors.json`)
    }
  }
})

// doona's help links name a page and an anchor; a docs-side deletion would leave the app pointing at nothing.
const appRefs = [`v${versions.doona}`, 'main']
const appAnchorsUrl = ref => `https://raw.githubusercontent.com/Zakkaus/doona/${ref}/src/features/shared/docsAnchors.json`
test('every anchor the doona app links exists on its page in every locale', async (t) => {
  assert.ok(versions.doona, 'docs/.vitepress/generated/versions.json has no doona version; run npm run docs:prepare with network access')
  for (const ref of appRefs) {
    await t.test(ref, async () => {
      let contract
      try {
        const response = await fetch(appAnchorsUrl(ref), { signal: AbortSignal.timeout(30000) })
        assert.ok(response.ok, `HTTP ${response.status}`)
        contract = await response.json()
      } catch (error) {
        assert.fail(`Cannot read doona's docsAnchors.json at ${ref} (${appAnchorsUrl(ref)}): ${error.message}`)
      }
      assert.ok(Object.keys(contract).length > 0, `${ref}: docsAnchors.json is empty`)
      for (const [anchor, topic] of Object.entries(contract)) {
        assert.equal(anchors[anchor], topic, `${ref}: doona links #${anchor} on ${topic}, anchors.json has ${anchors[anchor] ?? 'no such anchor'}`)
        for (const lang of langs) {
          assert.ok(page(lang, topic)?.ids.includes(anchor), `${ref}: ${lang}/${topic} has no {#${anchor}}`)
        }
      }
    })
  }
})

const sitePrefixes = Object.values(locales).map(locale => locale.prefix)
const siteRoute = path => {
  const prefix = sitePrefixes.find(prefix => prefix && path.startsWith(`${prefix}/`))
  return prefix ? path.slice(prefix.length) : path
}
const isPage = route => {
  const topic = route.replace(/^\/doona\/?/, '').replace(/\/$/, '') || 'index'
  return route.startsWith('/doona') && topics.includes(topic)
}

test('every local link and image resolves, and none leaves for the doona site', async () => {
  let links = 0, images = 0
  for (const { lang, topic, text } of pages.values()) {
    const where = `${lang}/${topic}`
    const prose = text.replace(/^\s*(`{3,}|~{3,}).*\n[\s\S]*?^\s*\1\s*$/gm, '')
    for (const [, url] of prose.matchAll(/(?:\]\(|\]:\s*|(?:href|src)=")<?([^\s)>"]+)/g)) {
      assert.doesNotMatch(url, /^https?:\/\/doona\.daeuniverse\.org/, `${where}: ${url} should link this site`)
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) continue
      const [target, hash] = url.split('#')
      if (!target) {
        if (hash) assert.ok(page(lang, topic).ids.includes(decodeURIComponent(hash)), `${where}: missing #${hash}`)
        continue
      }
      const path = decodeURI(target.split('?')[0])
      if (path.startsWith('/')) {
        const route = siteRoute(path)
        if (route.startsWith('/doona/images/')) { await access(join(publicRoot, route)); images++ }
        // Rendered from the documented doona release by the docs build; the next test checks them against the files.
        else if (route.startsWith('/doona/screenshots/')) continue
        // honk's OpenWrt package embeds doona, so the router install is the feed guide.
        else if (route === '/openwrt/') await access(join(root, 'docs/openwrt', lang, 'index.md'))
        else assert.ok(isPage(route), `${where}: ${url} is not a doona page or public file`)
      } else {
        assert.ok(/\.md$/.test(path), `${where}: relative link ${url} is not a page of this manual`)
        const destination = resolve(dirname(pagePath(lang, topic)), path)
        assert.equal(dirname(destination), join(manual, lang), `${where}: ${url} leaves the locale`)
        await access(destination)
        if (hash) assert.ok(pages.get(`${lang}/${path.replace(/\.md$/, '')}`).ids.includes(decodeURIComponent(hash)), `${where}: missing ${url}`)
        links++
      }
    }
  }
  assert.ok(links > 100, `Only ${links} links checked`)
  assert.ok(images >= 3, `Only ${images} images checked`)
})

async function markdownFiles(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return entry.name === 'node_modules' || entry.name === '.vitepress' ? [] : markdownFiles(path)
    return entry.name.endsWith('.md') ? [path] : []
  }))).flat()
}

test('no page of this site links the doona site', async () => {
  const files = await markdownFiles(join(root, 'docs'))
  assert.ok(files.length > 100)
  for (const path of files) {
    for (const [url] of (await readFile(path, 'utf8')).matchAll(/https?:\/\/doona\.daeuniverse\.org[^\s)"'<>]*/g)) {
      assert.fail(`${path}: ${url} should link this site's /doona/ pages`)
    }
  }
})

// The docs build renders the screenshots from the documented doona release into docs/public/doona/screenshots/ (see
// .github/actions/documentation and docs/DESIGN.md). A local run without them skips; CI must have them.
const screenshotRoot = join(publicRoot, 'doona/screenshots')
const exists = path => access(path).then(() => true, () => false)
test('every screenshot a page links is a rendered file', async (t) => {
  const screenshotLinks = new Set([...pages.values()].flatMap(({ text }) => [...text.matchAll(/(?:\]\(|src=")(\/doona\/screenshots\/[^\s)"]+)/g)].map(match => match[1])))
  assert.ok(screenshotLinks.size >= 30, `Only ${screenshotLinks.size} screenshot links found`)
  if (!await exists(screenshotRoot)) {
    assert.ok(!process.env.CI, `${screenshotRoot} is missing; the docs action renders it before the tests`)
    return t.skip(`${screenshotRoot} is missing: render the screenshots (docs/DESIGN.md) to check the screenshot links`)
  }
  for (const route of screenshotLinks) {
    const file = join(publicRoot, decodeURI(route))
    assert.ok((await stat(file).catch(() => null))?.size > 0, `${route} is not a rendered screenshot (${file})`)
  }
})

// A link into doona's GitHub source must name a path that exists in the checkout of the documented release, and for a
// Markdown file an anchor that GitHub renders for one of its headings.
const sourceLink = /https:\/\/github\.com\/Zakkaus\/doona\/(?:blob|tree)\/([^/\s)>"'#]+)\/([^\s)>"'#]*)(?:#([^\s)>"']+))?/g
const githubSlugs = text => {
  const seen = new Map(), slugs = new Set()
  let fence
  for (const line of text.split('\n')) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)
    if (marker) { fence = fence ? undefined : marker[1]; continue }
    if (fence) continue
    for (const [, id] of line.matchAll(/<(?:a name|[a-z]+ id)="([^"]+)"/g)) slugs.add(id)
    const heading = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/)
    if (!heading) continue
    const base = heading[1].replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]+>/g, '').replace(/[`*_~]/g, '')
      .toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '').replace(/ /g, '-')
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    slugs.add(count ? `${base}-${count}` : base)
  }
  return slugs
}
test('links into the doona source resolve in the checkout of the documented release', async (t) => {
  const checkout = process.env.DOONA_DIR && resolve(process.env.DOONA_DIR)
  if (!checkout) {
    assert.ok(!process.env.CI, 'DOONA_DIR must name the doona checkout in CI; the docs action sets it')
    return t.skip('DOONA_DIR is not set: point it at a doona checkout of the documented release to check the source links')
  }
  let checked = 0
  for (const { lang, topic, text } of pages.values()) {
    for (const [url, , path, hash] of text.matchAll(sourceLink)) {
      const where = `${lang}/${topic}: ${url}`
      const file = join(checkout, decodeURIComponent(path))
      const info = await stat(file).catch(() => null)
      assert.ok(info, `${where}: ${path || '/'} does not exist in ${checkout}`)
      if (hash && info.isFile() && /\.md$/.test(path)) {
        assert.ok(githubSlugs(await readFile(file, 'utf8')).has(decodeURIComponent(hash)), `${where}: no #${hash} in ${path}`)
      }
      checked++
    }
  }
  assert.ok(checked > 0, 'No links into the doona source found')
})

test('rendered pages keep callouts, tabs, screenshots and every local anchor', async () => {
  const md = await createMarkdownRenderer(join(root, 'docs'))
  for (const alert of ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION']) {
    const html = md.render(`> [!${alert}]\n> Keep this warning.`)
    assert.match(html, /custom-block/)
    assert.ok(html.includes('Keep this warning.'))
  }
  const rendered = new Map()
  let screenshots = 0, tabs = 0
  for (const { lang, topic, text } of pages.values()) {
    const path = pagePath(lang, topic)
    const html = md.render(text, { path, relativePath: `doona/${lang}/${topic}.md` })
    rendered.set(path, { html, ids: new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => decodeURIComponent(match[1]))) })
    if (text.includes('> [!')) assert.match(html, /custom-block/)
    if (text.includes('::: code-group')) { assert.match(html, /vp-code-group/); tabs++ }
    for (const [, url] of text.matchAll(/(?:\]\(|src=")(\/doona\/screenshots\/[^\s)"]+)/g)) {
      assert.ok(html.includes(url)); screenshots++
    }
  }
  let anchorLinks = 0
  for (const [path, { html }] of rendered) {
    for (const [, url] of html.matchAll(/\bhref="([^"]+)"/g)) {
      if (/^(?:[a-z]+:|\/\/|\/)/i.test(url)) continue
      const [file, hash] = url.split('#')
      if (!hash) continue
      const target = file ? resolve(dirname(path), decodeURIComponent(file).replace(/\.html$/, '.md')) : path
      assert.ok(rendered.has(target), `${path}: missing target ${url}`)
      assert.ok(rendered.get(target).ids.has(decodeURIComponent(hash)), `${path}: missing anchor ${url}`)
      anchorLinks++
    }
  }
  assert.ok(anchorLinks > 450, `Only ${anchorLinks} anchors checked`)
  for (const count of [screenshots, tabs]) assert.ok(count > 0)
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir, access } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
import { locales } from '../docs/.vitepress/locales.mjs'
import { createHonkAnchorRewriter, fallbackNotice, rewriteMarkdown, rewriteUrl, validateSources, verifyArchiveCommit } from '../scripts/fetch-docs.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const sources = JSON.parse(await readFile(join(root, 'docs/.vitepress/sources.json'), 'utf8'))
const inventory = JSON.parse(await readFile(join(root, 'docs/.vitepress/generated/fetched-docs.json'), 'utf8'))
const { honk } = sources
const blob = `${honk.repository}/blob/${honk.commit}/`

test('manual sources pin a release, revision, license and all site locales', () => {
  validateSources(sources)
  assert.deepEqual(Object.keys(sources), ['honk', 'doona'])
  assert.match(honk.ref, /^v\d+\.\d+\.\d+/)
  assert.match(honk.commit, /^[a-f0-9]{40}$/)
  assert.equal(honk.repository, 'https://github.com/daeuniverse/honk')
  assert.equal(honk.license, 'GPL-3.0-only')
  assert.deepEqual(Object.keys(honk.locales).sort(), Object.values(locales).map(locale => locale.lang).sort())
  assert.equal(honk.locales['en-US'], 'doc/en')
  assert.equal(honk.locales['zh-CN'], 'doc/zh')
  assert.equal(honk.locales['zh-TW'], honk.locales['zh-CN'])
  assert.throws(() => validateSources({ honk: { ...honk, commit: 'main' } }))
  assert.throws(() => validateSources({ honk: { ...honk, ref: '' } }))
})

test('archive metadata must identify the resolved pinned commit', () => {
  const archive = Buffer.alloc(1024)
  archive.write('pax_global_header')
  archive.write('00000000064', 124)
  archive.write(`52 comment=${honk.commit}\n`, 512)
  verifyArchiveCommit(gzipSync(archive), honk.commit)
  assert.throws(() => verifyArchiveCommit(gzipSync(archive), '0'.repeat(40)), /Archive commit/)
})

test('relative links and images stay local or resolve inside the pinned upstream tree', () => {
  const source = 'doc/en/reference/cli.md'
  for (const url of ['../configuration.md#example', './dns.md', '#usage', 'https://example.org/']) {
    assert.equal(rewriteUrl(url, source, 'doc/en', honk), url)
  }
  for (const [url, path] of [
    ['../../../config.dae', 'config.dae'],
    ['../../../AGENTS.md#rules', 'AGENTS.md#rules'],
    ['../../../crates/honk-core/src/lib.rs', 'crates/honk-core/src/lib.rs'],
    ['../../../images/example.png', 'images/example.png'],
    ['/config.dae', 'config.dae']
  ]) assert.equal(rewriteUrl(url, source, 'doc/en', honk), blob + path)
  assert.throws(() => rewriteUrl('../../../../escape', source, 'doc/en', honk), /leaves repository/)
  const input = '[config](../../../config.dae)\n![image](../../../images/example.png)\n[config]: ../../../config.dae\n<img src="../../../images/example.png">\n`[literal](../../../config.dae)`\n```md\n[literal](../../../config.dae)\n```'
  const output = rewriteMarkdown(input, source, 'doc/en', honk)
  assert.ok(output.includes(`[config](${blob}config.dae)`))
  assert.ok(output.includes(`![image](${blob}images/example.png)`))
  assert.ok(output.includes(`[config]: ${blob}config.dae`))
  assert.ok(output.includes(`src="${blob}images/example.png"`))
  assert.ok(output.includes('`[literal](../../../config.dae)`'))
  assert.ok(output.includes('```md\n[literal](../../../config.dae)\n```'))
})

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(async entry => entry.isDirectory()
    ? (await markdownFiles(join(directory, entry.name))).map(path => `${entry.name}/${path}`)
    : entry.name.endsWith('.md') && entry.name !== 'index.md' ? [entry.name] : []))).flat().sort()
}

test('every fetched topic is present, attributed and reachable in every locale', async () => {
  const topics = inventory.entries.filter(entry => entry.project === 'honk' && entry.locale === 'en-US').map(entry => entry.topic).sort()
  assert.equal(topics.length, 23, 'The pinned release contains 23 manual pages per source locale')
  assert.equal(new Set(topics).size, topics.length)
  for (const section of ['design', 'operations', 'reference']) assert.ok(topics.some(topic => topic.startsWith(`${section}/`)))
  for (const locale of Object.values(locales)) {
    const directory = join(root, 'docs/honk', locale.lang)
    const entries = inventory.entries.filter(entry => entry.project === 'honk' && entry.locale === locale.lang)
    assert.deepEqual(entries.map(entry => entry.topic).sort(), topics)
    assert.deepEqual(await markdownFiles(directory), [...topics, ...['arch', 'debian', 'docker', 'fedora', 'first-run', 'opensuse'].map(name => `installation/${name}.md`)].sort())
    await access(join(directory, 'installation/index.md'))
    const landing = await readFile(join(directory, 'index.md'), 'utf8')
    assert.ok(landing.includes(honk.ref))
    for (const topic of ['installation/', 'configuration.md', 'reference/cli.md']) assert.ok(landing.includes(`./${topic}`))
    for (const entry of entries) {
      const path = join(directory, entry.topic)
      const page = await readFile(path, 'utf8')
      assert.equal(page.match(/^# (.+)$/m)?.[1], entry.title)
      const footer = page.slice(page.lastIndexOf('</div>'))
      assert.ok(footer.includes(`${blob}${honk.locales[locale.lang]}/${entry.topic}`), path)
      assert.ok(footer.includes(`${blob}LICENSE`), path)
      assert.ok(footer.includes(honk.license), path)
      assert.equal(entry.fallback, locale.lang === 'zh-TW')
      if (entry.fallback) {
        assert.ok(page.indexOf(fallbackNotice) < page.indexOf('<div'), path)
        assert.ok(page.includes('lang="zh-CN"'), path)
      }
      const prose = page.replace(/^\s*```[^\n]*\n[\s\S]*?^\s*```/gm, '')
      for (const [, url] of prose.matchAll(/\]\(([^\s)]+)\)/g)) {
        if (url.startsWith(`${honk.repository}/blob/`)) assert.ok(url.startsWith(blob), url)
        if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) continue
        const target = resolve(dirname(path), decodeURI(url.split(/[?#]/)[0]))
        assert.ok(target.startsWith(`${directory}/`), `${path}: escaped manual: ${url}`)
        await access(target)
      }
    }
  }
})

test('doona transforms preserve heading anchors, literal examples and adjacent tabs', async () => {
  const { transformDoona, slugger } = await import('../scripts/fetch-docs.mjs')
  const slug = slugger()
  assert.deepEqual(['中文：設定', 'Repeat', 'Repeat', 'Repeat-1', 'Repeat'].map(slug),
    ['中文設定', 'repeat', 'repeat-1', 'repeat-1-1', 'repeat-2'])
  const input = '---\nkeywords: install, setup\n---\nEnglish / [简体中文](../zh-CN/install.md)\n\n# Install\n\n<a name="stable"></a>\n\n## 中文：設定\n\n```sh tab="sudo"\n# literal heading\nsudo command\n```\n\n```sh tab="root"\ncommand\n```\n\nProse\n\n```md\n## literal\n```'
  const result = transformDoona(input)
  assert.ok(!result.includes('keywords:') && !result.includes('../zh-CN'))
  assert.ok(result.includes('## 中文：設定 {#stable}'))
  assert.equal((result.match(/::: code-group/g) || []).length, 1)
  assert.ok(result.includes('```sh [sudo]\n# literal heading\nsudo command\n```'))
  assert.ok(result.includes('```md\n## literal\n```'))
  const { doona } = sources
  for (const path of ['docs/../en', '../docs/en', '/docs/en', 'docs/en/../../escape']) {
    assert.throws(() => validateSources({ doona: { ...doona, locales: { 'en-US': path } } }))
  }
  assert.equal(rewriteUrl('../images/example.svg', 'docs/en/index.md', 'docs/en', doona), '../images/example.svg')
  assert.equal(rewriteUrl('../screenshots/en/activity-light.webp', 'docs/en/index.md', 'docs/en', doona),
    'https://doona.daeuniverse.org/screenshots/en/activity-light.webp')
})

test('doona sections cover every fetched page exactly once in upstream order', async () => {
  const { default: config, doonaGroups } = await import('../docs/.vitepress/config.mjs')
  const topics = Object.values(doonaGroups).flat(2).map(topic => `${topic}.md`)
  assert.equal(new Set(topics).size, topics.length)
  assert.equal(topics.length, 29)
  for (const locale of Object.values(locales)) {
    const entries = inventory.entries.filter(entry => entry.project === 'doona' && entry.locale === locale.lang)
    assert.deepEqual(entries.map(entry => entry.topic).sort(), [...topics].sort())
    const key = Object.keys(locales).find(key => locales[key] === locale)
    const sidebar = config.locales[key].themeConfig.sidebar[`${locale.prefix}/doona/`]
    const manual = sidebar.find(item => item.text === 'doona')
    assert.ok(manual)
    // The group heading is the landing page, so the sections list every other page once.
    assert.equal(manual.link, `${locale.prefix}/doona/`)
    const links = items => items.flatMap(item => [item.link, ...links(item.items || [])])
    assert.deepEqual(manual.items.flatMap(section => links(section.items)),
      topics.filter(topic => topic !== 'index.md').map(topic => topic === 'install-openwrt.md'
        ? `${locale.prefix}/openwrt/` : `${locale.prefix}/doona/${topic.replace(/\.md$/, '')}`))
  }
})

test('doona rendered pages retain assets, callouts, tabs, attribution and every local anchor', async () => {
  const { createMarkdownRenderer } = await import('vitepress')
  const md = await createMarkdownRenderer(join(root, 'docs'))
  const { transformDoona } = await import('../scripts/fetch-docs.mjs')
  for (const alert of ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION']) {
    const html = md.render(transformDoona(`> [!${alert}]\n> Keep this warning.`))
    assert.match(html, /custom-block/)
    assert.ok(html.includes('Keep this warning.'))
  }
  const pages = new Map()
  let anchors = 0, images = 0, screenshots = 0, tabs = 0
  for (const entry of inventory.entries.filter(entry => entry.project === 'doona')) {
    const path = join(root, 'docs/doona', entry.locale, entry.topic)
    const text = await readFile(path, 'utf8')
    assert.equal(entry.fallback, false)
    assert.ok(!text.includes(fallbackNotice))
    assert.ok(!text.includes('tab="'))
    assert.ok(text.includes(`${sources.doona.repository}/blob/${sources.doona.commit}/${sources.doona.licensePath}`))
    const html = md.render(text, { path, relativePath: `doona/${entry.locale}/${entry.topic}` })
    pages.set(path, { html, ids: new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => decodeURIComponent(match[1]))) })
    if (text.includes('> [!')) { assert.match(html, /custom-block/) }
    if (text.includes('::: code-group')) { assert.match(html, /vp-code-group/); tabs++ }
    for (const [, url] of text.matchAll(/(?:\]\(|src=")([^\s)"]+)/g)) {
      if (url.startsWith('../images/')) { await access(resolve(dirname(path), url)); images++ }
      if (url.startsWith('https://doona.daeuniverse.org/screenshots/')) { assert.ok(html.includes(url)); screenshots++ }
    }
  }
  for (const [path, { html }] of pages) {
    for (const [, url] of html.matchAll(/\bhref="([^"]+)"/g)) {
      if (/^(?:[a-z]+:|\/\/)/i.test(url)) continue
      const [file, hash] = url.split('#')
      if (!hash) continue
      const target = file ? resolve(dirname(path), decodeURIComponent(file).replace(/\.html$/, '.md')) : path
      assert.ok(pages.has(target), `${path}: missing target ${url}`)
      assert.ok(pages.get(target).ids.has(decodeURIComponent(hash)), `${path}: missing anchor ${url}`)
      anchors++
    }
  }
  assert.ok(anchors > 450, `Only ${anchors} anchors checked`)
  for (const count of [images, screenshots, tabs]) assert.ok(count > 0)
})


test('honk fragments resolve to rendered target headings without changing literal examples', async () => {
  const pages = new Map([
    ['reference/api.md', '# API\n\n## `native_api`\n\n## Configuration DB (`--store db`)\n\n## 拉取、持久化与恢复\n\n## Repeat\n\n## Repeat\n'],
    ['configuration.md', '# Configuration\n']
  ])
  const rewrite = await createHonkAnchorRewriter(pages)
  const input = '[API](reference/api.md#native_api) [DB](reference/api.md?x=1#configuration-db---store-db)\n' +
    '[中文](reference/api.md#%E6%8B%89%E5%8F%96%E6%8C%81%E4%B9%85%E5%8C%96%E4%B8%8E%E6%81%A2%E5%A4%8D)\n' +
    '[repeat](reference/api.md#repeat-1) [external](https://example.org/#native_api)\n' +
    '`[literal](reference/api.md#native_api)`\n```md\n[literal](reference/api.md#native_api)\n```'
  const output = rewrite(input, 'configuration.md')
  assert.match(output, /api\.md#native-api/)
  assert.match(output, /api\.md\?x=1#configuration-db-store-db/)
  assert.match(output, /api\.md#拉取、持久化与恢复/)
  for (const preserved of ['#repeat-1', 'https://example.org/#native_api', '`[literal](reference/api.md#native_api)`', '```md\n[literal](reference/api.md#native_api)\n```']) assert.ok(output.includes(preserved))
  assert.equal(rewrite('[self](#native_api)', 'reference/api.md'), '[self](#native-api)')
  assert.equal(rewrite('[missing](#unknown)', 'reference/api.md'), '[missing](#unknown)')
  const ambiguous = await createHonkAnchorRewriter(new Map([['a.md', '# A\n\n## Foo-bar\n\n## Foobar']]))
  assert.throws(() => ambiguous('[ambiguous](#foo_bar)', 'a.md'), /Ambiguous honk heading/)
})

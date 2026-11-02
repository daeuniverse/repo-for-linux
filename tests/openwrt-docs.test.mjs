import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'
import { fetchOpenWrtDocs } from '../scripts/fetch-docs.mjs'
import { locales } from '../docs/.vitepress/locales.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = 'https://github.com/daeuniverse/openwrt-packages/tree/main/scripts/feed-site'
const topics = ['index.md', 'mirror.md', 'thanks.md']

test('OpenWrt site override preserves Markdown, wraps and attributes all locales, and rejects missing files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'openwrt-docs-'))
  const site = join(directory, 'site')
  const previous = process.env.DOCS_OPENWRT_SITE
  const body = [
    '## Install {#install}', '',
    '[Files](../files/) [Key](../public-key.pem) [Series](../25.12/x86_64/?sort=name#files)',
    '[Other series](../snapshots/packages/) [Mirror](./mirror.md) [Home](../index.md) [Thanks](thanks.md)',
    '[feed]: ../24.10/packages/ "Feed"', '<a href="../files/">Files</a>',
    '[Doona](https://doona.daeuniverse.org/en/install.html#doona) [Lite](https://doona.daeuniverse.org/zh-TW/)',
    '`[literal](../files/)`', '```sh', 'echo "../files/"', '```', '',
    '::: code-group', '',
    '```sh [OpenWrt]', 'echo "{{ literal }}"', '```', '',
    '```sh [ImmortalWrt]', 'echo install', '```', '', ':::', '',
    '::: details More information', '', '<code>apk</code> and <em>packages</em>.', '', ':::', '',
    '| Project | Source |', '| --- | --- |', '| Feed | <a href="https://example.org/">upstream</a> |'
  ].join('\n')
  try {
    for (const language of ['en', 'zh-cn', 'zh-tw']) {
      await mkdir(join(site, language), { recursive: true })
      for (const topic of topics) await writeFile(join(site, language, topic), `# ${language} ${topic}\n\n${body}\n`)
    }
    process.env.DOCS_OPENWRT_SITE = site
    const entries = await fetchOpenWrtDocs(directory)
    assert.equal(entries.length, 9)
    const md = await createMarkdownRenderer(join(root, 'docs'))
    for (const entry of entries) {
      const page = await readFile(join(directory, 'docs/openwrt', entry.locale, entry.topic), 'utf8')
      const original = await readFile(join(site, entry.source), 'utf8')
      assert.ok(page.startsWith('---\neditLink: false\nlastUpdated: false\n---\n'))
      const expected = original.replaceAll('](../files/)', '](https://openwrt.daeuniverse.org/files/)')
        .replace('](../public-key.pem)', '](https://openwrt.daeuniverse.org/public-key.pem)')
        .replace('](../25.12/', '](https://openwrt.daeuniverse.org/25.12/')
        .replace('](../snapshots/', '](https://openwrt.daeuniverse.org/snapshots/')
        .replace('[feed]: ../24.10/', '[feed]: https://openwrt.daeuniverse.org/24.10/')
        .replace('href="../files/"', 'href="https://openwrt.daeuniverse.org/files/"')
        .replace('](https://doona.daeuniverse.org/en/install.html#doona)', '](/doona/install#doona)')
        .replace('](https://doona.daeuniverse.org/zh-TW/)', '](/zh-TW/doona/)')
        .replace('`[literal](https://openwrt.daeuniverse.org/files/)`', '`[literal](../files/)`')
      assert.ok(page.includes(`<div v-pre lang="${entry.locale}">\n\n${expected.trim()}\n\n</div>`))
      assert.equal(entry.title, original.match(/^# (.+)$/m)[1])
      const footer = page.slice(page.lastIndexOf('</div>'))
      const label = { 'en-US': 'Source: [openwrt-packages feed site]', 'zh-CN': '来源：[openwrt-packages 软件源页面]', 'zh-TW': '來源：[openwrt-packages 套件來源頁面]' }[entry.locale]
      assert.ok(footer.includes(`${label}(${source})`))
      assert.doesNotMatch(footer, /license|LICENSE|许可证|授權條款/)
      const html = md.render(page)
      for (const pattern of [/id="install"/, /vp-code-group/, /data-title="OpenWrt"/, /data-title="ImmortalWrt"/, /<details/, /<summary>More information/, /<table\b/, /<code>apk<\/code>/, /<em>packages<\/em>/]) {
        assert.match(html, pattern)
      }
    }
    await rm(join(site, 'zh-tw/thanks.md'))
    await assert.rejects(fetchOpenWrtDocs(directory), error => error.code === 'ENOENT' && error.path === join(site, 'zh-tw/thanks.md'))
  } finally {
    if (previous === undefined) delete process.env.DOCS_OPENWRT_SITE
    else process.env.DOCS_OPENWRT_SITE = previous
    await rm(directory, { recursive: true, force: true })
  }
})

test('OpenWrt pages have localized routes, H1 sidebar titles and home links', async () => {
  const { default: config } = await import('../docs/.vitepress/config.mjs')
  const inventory = JSON.parse(await readFile(join(root, 'docs/.vitepress/generated/fetched-docs.json'), 'utf8'))
  for (const [key, locale] of Object.entries(locales)) {
    assert.equal(config.rewrites[`openwrt/${locale.lang}/:rest*`], `${locale.prefix.slice(1)}${locale.prefix ? '/' : ''}openwrt/:rest*`)
    const entries = inventory.entries.filter(entry => entry.project === 'openwrt' && entry.locale === locale.lang)
    assert.deepEqual(entries.map(entry => entry.topic), topics)
    const section = config.locales[key].themeConfig.sidebar[`${locale.prefix}/openwrt/`].find(item => item.text === locale.labels.openwrt)
    const links = topics.map(topic => `${locale.prefix}/openwrt/${topic === 'index.md' ? '' : topic.replace(/\.md$/, '')}`)
    assert.equal(section.link, links[0])
    assert.deepEqual(section.items, [
      ...entries.map((entry, index) => ({ text: [locale.labels.openwrtInstall, locale.labels.openwrtMirror, locale.labels.openwrtThanks][topics.indexOf(entry.topic)], link: links[index] })),
      { text: locale.labels.fileBrowser, link: 'https://openwrt.daeuniverse.org/files/' }
    ])
    for (const entry of entries) {
      const page = await readFile(join(root, 'docs/openwrt', locale.lang, entry.topic), 'utf8')
      assert.equal(entry.title, page.match(/^# (.+)$/m)[1])
    }
  }
})

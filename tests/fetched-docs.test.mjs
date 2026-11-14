import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir, access } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
import { locales } from '../docs/.vitepress/locales.mjs'
import { createHonkAnchorRewriter, fallbackNotice, splitSudoFences, rewriteMarkdown, rewriteUrl, validateSources, verifyArchiveCommit } from '../scripts/fetch-docs.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const sources = JSON.parse(await readFile(join(root, 'docs/.vitepress/sources.json'), 'utf8'))
const inventory = JSON.parse(await readFile(join(root, 'docs/.vitepress/generated/fetched-docs.json'), 'utf8'))
const { honk } = sources
const blob = `${honk.repository}/blob/${honk.commit}/`

test('manual sources pin a release, revision, license and all site locales', () => {
  validateSources(sources)
  assert.deepEqual(Object.keys(sources), ['honk'])
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
  for (const path of ['doc/../en', '../doc/en', '/doc/en', 'doc/en/../../escape']) {
    assert.throws(() => validateSources({ honk: { ...honk, locales: { 'en-US': path } } }))
  }
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
  assert.equal(topics.length, 24, 'The pinned release contains 24 manual pages per source locale')
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

test('honk shell blocks that use sudo get sudo and root tabs', () => {
  const input = ['Run:', '', '```sh', 'sudo mkdir -p /etc/honk', 'echo x | sudo tee /etc/honk/a', 'honk-core --version', '```', '',
    '```sh', 'sudo -u nobody id', '```', '', '```text', 'sudo stays', '```'].join('\n')
  assert.equal(splitSudoFences(input), ['Run:', '', '::: code-group', '', '```sh [sudo]', 'sudo mkdir -p /etc/honk',
    'echo x | sudo tee /etc/honk/a', 'honk-core --version', '```', '', '```sh [root]', 'mkdir -p /etc/honk', 'echo x | tee /etc/honk/a',
    'honk-core --version', '```', '', ':::', '', '```sh', 'sudo -u nobody id', '```', '', '```text', 'sudo stays', '```'].join('\n'))
})

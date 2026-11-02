import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { gunzipSync } from 'node:zlib'
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'

const root = fileURLToPath(new URL('../', import.meta.url))
export const fallbackNotice = '本頁暫以簡體中文顯示，待繁體中文翻譯完成後更新。'
// Worded as the dae pages' footers.
const footers = {
  'en-US': (project, page, license, licenseUrl) => `Source: [${project} upstream](${page}), licensed under [${license}](${licenseUrl}).`,
  'zh-CN': (project, page, license, licenseUrl) => `来源：[${project} 上游文档](${page})，采用 [${license} 许可证](${licenseUrl})。`,
  'zh-TW': (project, page, license, licenseUrl) => `來源：[${project} 上游文件](${page})，採用 [${license} 授權條款](${licenseUrl})。`
}

const keptPaths = { honk: ['index.md', 'installation/'] }

export function validateSources(sources) {
  for (const [project, source] of Object.entries(sources)) {
    if (!/^[a-z][a-z0-9-]*$/.test(project) ||
        !/^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/.test(source.repository) ||
        !/^[\w][\w.-]*$/.test(source.ref) || !/^[a-f0-9]{40}$/.test(source.commit) ||
        !source.license || !source.locales ||
        Object.entries(source.locales).some(([locale, directory]) =>
          !/^[a-z]{2}-[A-Z]{2}$/.test(locale) || !/^docs?\/[a-zA-Z-]+$/.test(directory))) {
      throw new Error(`Invalid documentation source: ${project}`)
    }
  }
}

export function rewriteUrl(url, sourcePath, sourceDirectory, source) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return url
  const [, path, suffix = ''] = url.match(/^([^?#]*)([?#].*)?$/)
  if (!path) return url
  const resolved = posix.normalize(path.startsWith('/') ? decodeURI(path).slice(1) : posix.join(posix.dirname(sourcePath), decodeURI(path)))
  if (resolved.startsWith(`${sourceDirectory}/`)) return url
  if (resolved.startsWith('../') || resolved === '..') throw new Error(`Link leaves repository: ${url}`)
  return `${source.repository}/blob/${source.commit}/${resolved.replace(/^\/+/, '')}${suffix}`
}

export function rewriteMarkdown(markdown, sourcePath, sourceDirectory, source) {
  return rewriteMarkdownLinks(markdown, url => rewriteUrl(url, sourcePath, sourceDirectory, source))
}

function rewriteMarkdownLinks(markdown, rewrite) {
  // Keep literal examples intact; only prose destinations are rewritten.
  let fence
  return markdown.split('\n').map(line => {
    const marker = line.match(/^\s*(`{3,}|~{3,})(.*)$/)
    if (marker) {
      if (!fence) fence = marker[1]
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = undefined
      return line
    }
    if (fence) return line
    return line.split(/(`+[^`]*`+)/g).map((part, i) => i % 2 ? part : part
      .replace(/(\]\(<?)([^\s<>]+?)(>?)(?=\s+["']|\))/g, (_, start, url, end) => `${start}${rewrite(url)}${end}`)
      .replace(/^(\s*\[[^\]]+\]:\s*<?)([^\s>]+)(>?)/, (_, start, url, end) => `${start}${rewrite(url)}${end}`)
      .replace(/((?:href|src)=["'])([^"']+)(["'])/g, (_, start, url, end) => `${start}${rewrite(url)}${end}`)
    ).join('')
  }).join('\n')
}

export async function createHonkAnchorRewriter(pages) {
  const md = await createMarkdownRenderer(join(root, 'docs'))
  const headings = new Map()
  const key = fragment => fragment.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, '')
  for (const [path, markdown] of pages) {
    const ids = md.parse(markdown, {}).filter(token => token.type === 'heading_open')
      .map(token => token.attrGet('id')).filter(Boolean)
    headings.set(path, ids)
  }
  return (markdown, topic) => rewriteMarkdownLinks(markdown, url => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(url) || !url.includes('#')) return url
    const hash = url.indexOf('#')
    const path = decodeURI(url.slice(0, hash).split('?')[0])
    const target = path ? posix.normalize(posix.join(posix.dirname(topic), path)) : topic
    const ids = headings.get(target.endsWith('.md') ? target : `${target}.md`)
    const fragment = decodeURIComponent(url.slice(hash + 1))
    if (!ids || ids.includes(fragment)) return url
    // Upstream fragments omit punctuation that VitePress keeps or turns into separators.
    const matches = ids.filter(id => key(id) === key(fragment))
    if (matches.length > 1) throw new Error(`Ambiguous honk heading: ${topic} -> ${url}`)
    return matches.length ? `${url.slice(0, hash + 1)}${matches[0]}` : url
  })
}

async function download(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(60000) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      if (attempt === 3) throw new Error(`Cannot fetch ${url}: ${error.message}`)
      console.warn(`Retrying ${url} after ${error.message}`)
      await new Promise(resolve => setTimeout(resolve, attempt * 2000))
    }
  }
}

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Unexpected documentation symlink: ${path}`)
    return entry.isDirectory() ? (await files(path)).map(name => `${entry.name}/${name}`) : [entry.name]
  }))).flat().sort()
}

export function verifyArchiveCommit(compressed, commit) {
  const archive = gunzipSync(compressed)
  const header = archive.subarray(0, 100).toString().replace(/\0.*$/s, '')
  const size = Number.parseInt(archive.subarray(124, 136).toString(), 8)
  const metadata = archive.subarray(512, 512 + size).toString()
  if (header !== 'pax_global_header' || !metadata.split('\n').includes(`52 comment=${commit}`)) {
    throw new Error(`Archive commit does not match ${commit}`)
  }
}

// The feed site links the doona manual at its old address; the manual is a section of this site now.
const doonaPrefixes = { en: '', 'zh-CN': '/zh-CN', 'zh-TW': '/zh-TW' }
export function localDoonaUrl(url) {
  const match = url.match(/^https:\/\/doona\.daeuniverse\.org\/(en|zh-CN|zh-TW)\/([^?#]*?)(?:\.html)?([?#].*)?$/)
  if (!match) return url
  const [, locale, page, suffix = ''] = match
  return `${doonaPrefixes[locale]}/doona/${page === 'index' ? '' : page}${suffix}`
}

export async function fetchOpenWrtDocs(outputRoot = root) {
  const site = process.env.DOCS_OPENWRT_SITE
  const source = 'https://github.com/daeuniverse/openwrt-packages/tree/main/scripts/feed-site'
  const footers = {
    'en-US': `Source: [openwrt-packages feed site](${source}).`,
    'zh-CN': `来源：[openwrt-packages 软件源页面](${source})。`,
    'zh-TW': `來源：[openwrt-packages 套件來源頁面](${source})。`
  }
  const entries = []
  for (const [locale, language] of Object.entries({ 'en-US': 'en', 'zh-CN': 'zh-cn', 'zh-TW': 'zh-tw' })) {
    const target = join(outputRoot, 'docs/openwrt', locale)
    await mkdir(target, { recursive: true })
    for (const topic of ['index.md', 'mirror.md', 'thanks.md']) {
      const path = `${language}/${topic}`
      const url = `https://openwrt.daeuniverse.org/${path}`
      const content = site ? await readFile(join(site, path)) : await download(url)
      const text = rewriteMarkdownLinks(content.toString('utf8'), link =>
        /^\.\.\/(?:files(?:[/?#]|$)|public-key\.pem(?:[?#]|$)|[^/?#]+\/)/.test(link)
          ? new URL(link, url).href : localDoonaUrl(link))
      const title = text.match(/^#\s+(.+)$/m)?.[1]
      if (!title) throw new Error(`Missing page title: ${url}`)
      await writeFile(join(target, topic), `---\neditLink: false\nlastUpdated: false\n---\n\n<div v-pre lang="${locale}">\n\n${text.trim()}\n\n</div>\n\n---\n\n${footers[locale]}\n`)
      entries.push({ project: 'openwrt', locale, topic, title, source: path, fallback: false })
    }
  }
  console.log('Fetched OpenWrt feed documentation')
  return entries
}

export async function fetchDocs() {
  const sources = JSON.parse(await readFile(join(root, 'docs/.vitepress/sources.json'), 'utf8'))
  validateSources(sources)
  const entries = await fetchOpenWrtDocs()
  const directory = await mkdtemp(join(tmpdir(), 'fetched-docs-'))
  try {
    for (const [project, source] of Object.entries(sources)) {
      const repository = source.repository.replace('https://github.com/', '')
      // The archive is fetched by commit and checked against it; the tag only names the release.
      const archive = join(directory, `${project}.tar.gz`)
      const compressed = await download(`https://codeload.github.com/${repository}/tar.gz/${source.commit}`)
      verifyArchiveCommit(compressed, source.commit)
      await writeFile(archive, compressed)
      const prefix = `${repository.split('/')[1]}-${source.commit}`
      const members = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split('\n')
      if (members.some(name => !name.startsWith(`${prefix}/`) || name.split('/').includes('..'))) {
        throw new Error(`${project}: archive does not match pinned commit ${source.commit}`)
      }
      const directories = [...new Set(Object.values(source.locales))]
      execFileSync('tar', ['-xzf', archive, '-C', directory, '--', ...directories.map(path => `${prefix}/${path}`)])
      for (const [locale, sourceDirectory] of Object.entries(source.locales)) {
        const target = join(root, 'docs', project, locale)
        // Keep committed pages alongside the fetched manual.
        const keep = keptPaths[project] || ['index.md']
        await mkdir(target, { recursive: true })
        for (const name of await readdir(target)) {
          if (!keep.includes(name) && !keep.includes(`${name}/`)) await rm(join(target, name), { recursive: true, force: true })
        }
        const topics = await files(join(directory, prefix, sourceDirectory))
        const fixAnchors = project === 'honk'
          ? await createHonkAnchorRewriter(new Map(await Promise.all(topics.filter(topic => topic.endsWith('.md'))
            .map(async topic => [topic, await readFile(join(directory, prefix, sourceDirectory, topic), 'utf8')]))))
          : text => text
        for (const topic of topics) {
          if (keep.some(path => topic === path || (path.endsWith('/') && topic.startsWith(path)))) {
            throw new Error(`${project}: upstream ${topic} conflicts with a committed page`)
          }
          const sourcePath = `${sourceDirectory}/${topic}`
          const output = join(target, topic)
          await mkdir(dirname(output), { recursive: true })
          const content = await readFile(join(directory, prefix, sourcePath))
          if (!topic.endsWith('.md')) {
            await writeFile(output, content)
            continue
          }
          const text = content.toString('utf8')
          const title = text.match(/^#\s+(.+)$/m)?.[1]
          if (!title) throw new Error(`Missing page title: ${sourcePath}`)
          const fallback = locale === 'zh-TW' && sourceDirectory === source.locales['zh-CN']
          const notice = fallback ? `::: info\n${fallbackNotice}\n:::\n\n` : ''
          const blob = `${source.repository}/blob/${source.commit}`
          const footer = footers[fallback ? 'zh-TW' : locale](project, `${blob}/${sourcePath}`, source.license, `${blob}/${'LICENSE'}`)
          // The feed site's guide pages now live in this site, so link the local copy.
          const openwrtPrefix = { 'en-US': '', 'zh-CN': '/zh-CN', 'zh-TW': '/zh-TW' }[locale]
          const body = rewriteMarkdownLinks(rewriteMarkdown(fixAnchors(text, topic), sourcePath, sourceDirectory, source),
            link => link.replace(/^https:\/\/openwrt\.daeuniverse\.org\/(?:en|zh-cn|zh-tw)\/(?:index\.html)?((?:mirror|thanks)(?:\.html)?)?(#.*)?$/,
              (_, page, hash) => `${openwrtPrefix}/openwrt/${(page || '').replace(/\.html$/, '')}${hash || ''}`))
          await writeFile(output, `---\neditLink: false\nlastUpdated: false\n---\n\n${notice}<div v-pre lang="${fallback ? 'zh-CN' : locale}">\n\n${body.trim()}\n\n</div>\n\n---\n\n${footer}\n`)
          entries.push({ project, locale, topic, title, source: sourcePath, fallback })
        }
      }
      console.log(`Fetched ${project} ${source.ref} (${source.commit})`)
    }
    const generated = join(root, 'docs/.vitepress/generated')
    await mkdir(generated, { recursive: true })
    await writeFile(join(generated, 'fetched-docs.json'), JSON.stringify({ entries }, null, 2) + '\n')
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await fetchDocs()

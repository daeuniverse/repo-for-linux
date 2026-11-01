import { readFile, readdir } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const decode = text => text.replace(/&(?:#(x[\da-f]+|\d+)|(amp|quot|apos|lt|gt));/gi, (_, code, name) =>
  code ? String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code))
    : ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' })[name.toLowerCase()])

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? htmlFiles(join(directory, entry.name))
    : entry.name.endsWith('.html') ? [join(directory, entry.name)] : []))).flat()
}

export async function checkAnchors(directory, site = 'https://daeuniverse.pages.dev/') {
  const base = new URL(site)
  const pages = new Map()
  for (const path of await htmlFiles(directory)) {
    const html = (await readFile(path, 'utf8')).replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    const ids = new Set()
    const links = []
    for (const [tag, name] of html.matchAll(/<([a-z][\w:-]*)\b[^>]*>/gi)) {
      const attribute = key => {
        const value = tag.match(new RegExp(`\\s${key}=(["'])(.*?)\\1`, 'i'))?.[2]
        return value === undefined ? undefined : decode(value)
      }
      const id = attribute('id')
      if (id !== undefined) ids.add(id)
      if (name.toLowerCase() !== 'a') continue
      const anchor = attribute('name')
      if (anchor !== undefined) ids.add(anchor)
      const href = attribute('href')
      if (href !== undefined) links.push(href)
    }
    pages.set(relative(directory, path), { ids, links })
  }
  if (!pages.size) throw new Error(`No built HTML pages found in ${directory}`)
  const failures = []
  let checked = 0
  for (const [page, { links }] of pages) {
    const current = new URL(page.replace(/index\.html$/, ''), base)
    for (const href of new Set(links)) {
      const target = new URL(href, current)
      if (target.origin !== base.origin || !target.pathname.startsWith(base.pathname) || !target.hash) continue
      const fragment = decodeURIComponent(target.hash.slice(1).split(':~:')[0])
      if (!fragment || fragment === 'top') continue
      checked++
      const path = decodeURIComponent(target.pathname.slice(base.pathname.length))
      const destination = [path, `${path}.html`, `${path.replace(/\/$/, '')}/index.html`, path === '' ? 'index.html' : '']
        .find(candidate => pages.has(candidate))
      if (!destination || !pages.get(destination).ids.has(fragment)) failures.push({ page, href, fragment })
    }
  }
  return { pages: pages.size, checked, failures }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const directory = process.argv[2] || resolve('docs', process.env.DOCS_OUT_DIR || '.vitepress/dist')
  const site = process.env.DOCS_SITE_URL || new URL(process.env.DOCS_BASE || '/', 'https://daeuniverse.pages.dev').href
  const result = await checkAnchors(directory, site)
  console.log(JSON.stringify(result, null, 2))
  if (result.failures.length) process.exitCode = 1
}

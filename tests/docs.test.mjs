import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { locales } from '../docs/.vitepress/locales.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const guideDirectory = locale => join(root, `docs/dae/${locale.lang}/installation`)
const guideFile = (locale, page) => ['packages.md', 'maintenance.md'].includes(page)
  ? join(root, `docs${locale.prefix}/guide`, page)
  : join(guideDirectory(locale), page)
const commands = text => [...text.matchAll(/```(?:shell|sh|text)(?: \[[^\n]+\])?\n([\s\S]*?)```/g)].map(match => match[1])

// A command needing root is offered twice: a `sudo` tab and a `root` tab carrying
// the same commands without the prefix. Tabs that name something else — an APT
// version, a package — keep that name and add the privilege after a separator.
function assertPrivilegeTabs(text, label) {
  const tabs = [...text.matchAll(/```sh \[([^\n]+)\]\n([\s\S]*?)```/g)]
    .filter(tab => /(^|·\s*)(sudo|root)$/.test(tab[1]))
  assert.ok(tabs.length > 0 && tabs.length % 2 === 0, label)
  for (let i = 0; i < tabs.length; i += 2) {
    assert.match(tabs[i][1], /sudo$/, label)
    assert.match(tabs[i + 1][1], /root$/, label)
    assert.equal(tabs[i][1].replace(/sudo$/, ''), tabs[i + 1][1].replace(/root$/, ''), label)
    assert.equal(tabs[i][2].replace(/^sudo /gm, ''), tabs[i + 1][2], label)
    assert.ok(tabs[i][2].trim().split('\n').every(line => line.startsWith('sudo ')), label)
  }
}

async function readDocument(path) {
  let text = await readFile(path, 'utf8')
  for (const match of text.matchAll(/<!--@include: @\/(.*?)-->/g)) {
    const included = match[1].trim()
    if (!included.startsWith('.vitepress/snippets/')) continue
    text = text.replace(match[0], await readFile(join(root, 'docs', included), 'utf8'))
  }
  return text
}

function restoreCommandGroups(text, lang) {
  const shellLabels = {
    'en-US': ['For Bash and Zsh:', 'for fish shell:'],
    'zh-CN': ['对于 Bash 和 Zsh：', '对于 fish shell：'],
    'zh-TW': ['適用於 Bash 與 Zsh：', '適用於 fish shell：']
  }
  text = text.replace(/::: code-group\n\n```shell \[Bash \/ Zsh\]\n([\s\S]*?)```\n\n```fish \[fish\]\n([\s\S]*?)```\n\n:::/g,
    (_, bash, fish) => {
      const [bashLabel, fishLabel] = shellLabels[lang]
      return `${bashLabel}\n\n\x60\x60\x60shell\n${bash}\x60\x60\x60\n\n${fishLabel}\n\n\x60\x60\x60fish\n${fish}\x60\x60\x60`
    })
  return text.replace(/::: code-group\n\n```shell \[(sudo|yay)\]\n([\s\S]*?)```\n\n```shell \[(root|paru)\]\n([\s\S]*?)```\n\n:::/g,
    (_, first, original, second, alternative) => {
      if (first === 'sudo') {
        assert.equal(second, 'root')
        assert.match(original, /^sudo /m)
        assert.equal(alternative, original.replace(/^sudo /gm, ''), 'Root commands must only remove sudo')
      } else {
        assert.equal(second, 'paru')
        assert.match(original, /^yay /m)
        assert.equal(alternative, original.replace(/^yay /gm, 'paru '), 'AUR tabs must only change the helper')
        original = original.replace(/^yay /gm, '[yay/paru] ')
      }
      return '```shell\n' + original + '```'
    })
}

function fencedCodeHashes(text) {
  const hashes = []
  let fence, block = ''
  for (const line of text.match(/[^\n]*\n|[^\n]+$/g) || []) {
    const marker = line.trimEnd().match(/^\s*(`{3,}|~{3,})(.*)$/)
    if (!fence) {
      if (marker) { fence = marker[1]; block = line }
    } else {
      block += line
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) {
        hashes.push(createHash('sha256').update(block.replace(/\n$/, '')).digest('hex'))
        fence = undefined
      }
    }
  }
  assert.equal(fence, undefined, 'Unclosed code fence')
  return hashes
}

function requiredKeys(source, target, path = '') {
  for (const [key, value] of Object.entries(source)) {
    assert.ok(Object.hasOwn(target, key), `Missing message: ${path}${key}`)
    if (value && typeof value === 'object') requiredKeys(value, target[key], `${path}${key}.`)
  }
}

test('translated documents preserve routes, commands and required messages', async () => {
  const pages = [...(await readdir(guideDirectory(locales.root))), ...(await readdir(join(root, 'docs/guide')))].filter(name => name.endsWith('.md')).sort()
  const sourceCommands = []
  for (const page of pages) sourceCommands.push(...commands(await readDocument(guideFile(locales.root, page))))
  for (const command of commands(await readFile(join(root, 'README.md'), 'utf8'))) {
    const daeExample = command.replace(/\b(apt|dnf|zypper) install v2raya\b/g, "$1 install dae")
    assert.ok(sourceCommands.includes(daeExample), `README setup command or dae example missing: ${daeExample}`)
  }
  for (const locale of Object.values(locales)) {
    requiredKeys(locales.root.labels, locale.labels)
    if (!locale.prefix) continue
    const directory = join(root, `docs${locale.prefix}`)
    assert.deepEqual([...(await readdir(guideDirectory(locale))), ...(await readdir(join(directory, 'guide')))].filter(name => name.endsWith('.md')).sort(), pages)
    for (const page of pages) {
      const source = await readDocument(guideFile(locales.root, page))
      const translated = await readDocument(guideFile(locale, page))
      assert.deepEqual(commands(translated), commands(source), `${locale.lang}/${page}`)
    }
    const home = await readFile(join(directory, 'index.md'), 'utf8')
    assert.ok(home.includes(`${locale.prefix}/dae/`), `${locale.lang}: missing quick-start entry`)
  }
})

test('repository setup is shared and primary install commands offer sudo and root', async () => {
  for (const locale of Object.values(locales)) {
    for (const project of ['dae', 'daed']) {
      for (const name of ['debian', 'fedora', 'opensuse']) {
        const packages = await readFile(join(root, `docs${locale.prefix}/guide/packages/${name}.md`), 'utf8')
        const path = join(root, `docs/${project}/${locale.lang}/installation/${name}.md`)
        const source = await readFile(path, 'utf8')
        const includes = [...source.matchAll(/<!--@include: @\/(.*?)-->/g)]
        assert.ok(includes.length > 0, path)
        for (const match of includes) assert.ok(packages.includes(match[0]), path)
        const primary = (await readDocument(path)).split(':::: details')[0]
        assertPrivilegeTabs(primary, path)
      }
    }
  }
})

test('installation privilege tabs preserve the same commands', async () => {
  for (const name of ['gentoo']) {
    const page = await readDocument(guideFile(locales.root, `${name}.md`))
    assertPrivilegeTabs(page, name)
  }
})

test('the gentoo overlay setup is shared by every gentoo page', async () => {
  const source = await readDocument(join(root, 'docs/guide/packages/gentoo.md'))
  for (const locale of Object.values(locales)) {
    const include = `<!--@include: @/.vitepress/snippets/repositories/${locale.lang}/gentoo-1.md-->`
    const packages = `docs${locale.prefix}/guide/packages/gentoo.md`
    for (const page of [packages, `docs/dae/${locale.lang}/installation/gentoo.md`, `docs/daed/${locale.lang}/installation/gentoo.md`]) {
      assert.ok((await readFile(join(root, page), 'utf8')).includes(include), page)
    }
    assert.deepEqual(commands(await readDocument(join(root, packages))), commands(source), packages)
  }
})

test('the version menu and the package table come from the same rows', async () => {
  // The generated directory is a build product, so this generates its own rather
  // than reading whatever a previous build happened to leave in the working tree.
  const directory = await mkdtemp(join(tmpdir(), 'dae-versions-'))
  try {
    await cp(join(root, 'scripts/prepare-docs.mjs'), join(directory, 'scripts/prepare-docs.mjs'), { recursive: true })
    const fixture = blankVersions(await readFile(join(root, 'README.md'), 'utf8'))
    await writeFile(join(directory, 'README.md'), fixture)
    // One package stays unresolved, so the two files have to disagree in the one
    // way that matters: the row keeps N/A and the menu leaves the package out.
    const [withheld] = fixture.match(/^\| ([^|]+) \| N\/A \|/m).slice(1).map(cell => cell.trim())
    const statusPath = join(directory, 'status.md')
    await writeFile(statusPath, fixture.split('\n')
      .map(line => line.startsWith(`| ${withheld} |`) ? line : line.replace('| N/A |', '| test-version |'))
      .join('\n'))
    execFileSync(process.execPath, ['scripts/prepare-docs.mjs'], { cwd: directory, stdio: 'pipe',
      env: { ...process.env, DOCS_STATUS_README: statusPath, DOCS_ALLOW_MISSING_VERSIONS: 'true' } })

    const generated = join(directory, 'docs/.vitepress/generated')
    const rows = (await readFile(join(generated, 'package-rows.md'), 'utf8')).trim().split('\n')
      .map(row => row.split('|').slice(1, -1).map(cell => cell.trim()))
    const versions = JSON.parse(await readFile(join(generated, 'versions.json'), 'utf8'))
    assert.deepEqual(versions, Object.fromEntries(rows.filter(row => row[1] !== 'N/A').map(row => [row[0], row[1]])))
    // A package the build could not resolve is absent, so the menu never offers 'N/A'.
    assert.ok(!Object.values(versions).includes('N/A'))
    assert.equal(rows.find(row => row[0] === withheld)[1], 'N/A')
    assert.ok(!(withheld in versions), `${withheld} resolved to no version and must not reach the menu`)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('the package installation links are shared by every page that lists them', async () => {
  for (const locale of Object.values(locales)) {
    const include = `<!--@include: @/.vitepress/snippets/packages/${locale.lang}/install.md-->`
    for (const page of [`docs${locale.prefix}/guide/packages.md`, `docs/dae/${locale.lang}/installation/index.md`, `docs/daed/${locale.lang}/index.md`]) {
      assert.ok((await readFile(join(root, page), 'utf8')).includes(include), page)
    }
    const links = await readFile(join(root, `docs/.vitepress/snippets/packages/${locale.lang}/install.md`), 'utf8')
    for (const name of ['debian', 'fedora', 'opensuse', 'gentoo', 'arch']) {
      assert.ok(links.includes(`(${locale.prefix}/guide/packages/${name})`), `${locale.lang}: missing ${name}`)
    }
    // The three overview pages describe the same repository, so each one has to
    // reach the other two.
    const overview = {
      [`docs${locale.prefix}/guide/packages.md`]: [`(${locale.prefix}/dae/installation/)`, `(${locale.prefix}/daed/)`],
      [`docs/dae/${locale.lang}/installation/index.md`]: [`(${locale.prefix}/daed/)`, `(${locale.prefix}/guide/packages)`],
      [`docs/daed/${locale.lang}/index.md`]: [`(${locale.prefix}/dae/installation/)`, `(${locale.prefix}/guide/packages)`]
    }
    for (const [page, targets] of Object.entries(overview)) {
      const text = await readFile(join(root, page), 'utf8')
      for (const target of targets) assert.ok(text.includes(target), `${page}: missing link to ${target}`)
    }
  }
})

function blankVersions(readme) {
  // The repository build fills the table before this test runs, so normalise the
  // fixture back to N/A instead of depending on the state of the working tree.
  return readme.replace(/<!-- BEGIN GENERATED PACKAGE TABLE -->[\s\S]*?<!-- END GENERATED PACKAGE TABLE -->/,
    block => block.split('\n').map(line => {
      const cells = line.split('|')
      if (cells.length !== 6 || cells[1].trim() === 'Software' || /^\s*-+\s*$/.test(cells[2])) return line
      return [cells[0], cells[1], ' N/A ', ...cells.slice(3)].join('|')
    }).join('\n'))
}

test('all package references include the same generated data; malformed data fails', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dae-docs-'))
  try {
    await cp(join(root, 'scripts/prepare-docs.mjs'), join(directory, 'scripts/prepare-docs.mjs'), { recursive: true })
    const statusPath = join(directory, 'status.md')
    const fixtureReadme = blankVersions(await readFile(join(root, 'README.md'), 'utf8'))
    await writeFile(join(directory, 'README.md'), fixtureReadme)
    await writeFile(statusPath, fixtureReadme.replaceAll('| N/A |', '| test-version |'))
    // Clear the opt-out explicitly: the repository build sets it, and inheriting it
    // here would silence the failure this test asserts.
    const prepare = () => execFileSync(process.execPath, ['scripts/prepare-docs.mjs'], { cwd: directory, stdio: 'pipe', env: { ...process.env, DOCS_STATUS_README: statusPath, DOCS_ALLOW_MISSING_VERSIONS: '' } })
    prepare()
    const rows = await readFile(join(directory, 'docs/.vitepress/generated/package-rows.md'), 'utf8')
    const readme = await readFile(join(directory, 'README.md'), 'utf8')
    assert.ok(readme.replaceAll('| N/A |', '| test-version |').includes(rows.trim()))
    await writeFile(statusPath, fixtureReadme)
    assert.throws(prepare, error => /Missing status version/.test(error.stderr.toString()))
    // The repository build opts out so a package that failed to build cannot withhold
    // the deployment; the row keeps N/A instead.
    execFileSync(process.execPath, ['scripts/prepare-docs.mjs'], { cwd: directory, stdio: 'pipe', env: { ...process.env, DOCS_STATUS_README: statusPath, DOCS_ALLOW_MISSING_VERSIONS: 'true' } })
    assert.match(await readFile(join(directory, 'docs/.vitepress/generated/package-rows.md'), 'utf8'), /\| N\/A \|/)
    await writeFile(join(directory, 'README.md'), readme.replaceAll('| N/A |', '| built-version |'))
    prepare()
    assert.ok((await readFile(join(directory, 'docs/.vitepress/generated/package-rows.md'), 'utf8')).includes('| built-version |'))
    await writeFile(join(directory, 'README.md'), readme)
    for (const locale of Object.values(locales)) {
      for (const path of [`docs${locale.prefix}/guide/packages.md`, `docs/dae/${locale.lang}/installation/index.md`]) {
        const page = await readFile(join(root, path), 'utf8')
        assert.ok(page.includes('<!--@include: @/.vitepress/generated/package-rows.md-->'), `${path}: package rows must resolve from the docs root`)
      }
    }
    await writeFile(join(directory, 'README.md'), readme.replace('<!-- END GENERATED PACKAGE TABLE -->', ''))
    assert.throws(prepare, error => /markers are missing/.test(error.stderr.toString()))
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('every upstream topic exists in every locale and retains its original examples', async () => {
  const manifest = JSON.parse(await readFile(join(root, 'docs/.vitepress/upstream.json'), 'utf8'))
  assert.match(manifest.revision, /^[a-f0-9]{40}$/)
  const topics = manifest.entries.filter(entry => entry.locale === locales.root.lang).map(entry => entry.topic).sort()
  assert.equal(topics.length, 21, 'Pinned upstream snapshot contains 21 distinct topics')
  assert.equal(new Set(topics).size, topics.length)
  assert.ok(topics.includes('development/refactor-validation-plan.md'))
  for (const locale of Object.values(locales)) {
    const entries = manifest.entries.filter(entry => entry.locale === locale.lang)
    assert.deepEqual(entries.map(entry => entry.topic).sort(), topics)
    for (const entry of entries) {
      const page = await readFile(join(root, 'docs', entry.path), 'utf8')
      assert.equal(entry.fallback, false, `${entry.path} still uses a fallback language`)
      assert.ok(page.includes(`lang="${locale.lang}"`), entry.path)
      assert.ok(page.includes(`/blob/${manifest.revision}/${entry.source}`), entry.path)
      assert.ok(page.indexOf(`/blob/${manifest.revision}/${entry.source}`) > page.lastIndexOf('</div>'), `${entry.path}: source notice must follow the article`)
      let content = page
      for (const part of entry.contentParts || []) {
        const target = await readFile(join(root, 'docs', part.path), 'utf8')
        const moved = target.split(`<!-- ${part.marker}:start -->`)[1]?.split(`<!-- ${part.marker}:end -->`)[0]
        assert.ok(moved, `Missing moved section: ${part.path}`)
        const section = restoreCommandGroups(moved, locale.lang)
        let fence = false
        const normalized = section.trim().split('\n').map(line => {
          if (/^\s*```/.test(line)) fence = !fence
          return fence ? line : line.replace(/^#{1,6} /, '')
        }).join('\n')
        assert.equal(createHash('sha256').update(normalized).digest('hex'), part.sha256, `${part.path}: moved prose changed`)
        content += '\n' + section
      }
      const hashes = fencedCodeHashes(content)
      const replacements = [...(entry.codeReplacements || []), ...(entry.contentParts || []).flatMap(part => part.codeReplacements || [])]
      for (const change of entry.codeReplacements || []) {
        assert.ok(entry.sourceCodeSha256.includes(change.originalSha256), `${entry.path}: replacement must identify an original example`)
        assert.ok(change.reason && Array.isArray(change.sha256) && change.sha256.length, `${entry.path}: document the replacement`)
      }
      const retainedHashes = [...entry.sourceCodeSha256]
      let headingCount = (content.match(/^#{1,6} /gm) || []).length
      for (const duplicate of entry.deduplicatedSections || []) {
        const replacement = await readDocument(join(root, 'docs', duplicate.replacement))
        headingCount += (replacement.match(/^#{1,6} /gm) || []).length
        if (duplicate.sha256) {
          // The page carries these examples itself (privilege tabs included); each listed hash must be present.
          const present = fencedCodeHashes(replacement)
          for (const hash of duplicate.sha256) assert.ok(present.includes(hash), `${duplicate.replacement}: deduplicated example missing`)
        } else {
          assert.ok(replacement.includes('emerge --ask net-proxy/dae::gentoo-zh'))
        }
        for (const hash of duplicate.originalCodeSha256) {
          const index = retainedHashes.indexOf(hash)
          assert.notEqual(index, -1, 'Deduplicated example must exist in the original source')
          retainedHashes.splice(index, 1)
        }
      }
      const expectedHashes = [...retainedHashes.flatMap(hash => replacements.find(change => change.originalSha256 === hash)?.sha256 || hash), ...(entry.additionalCodeSha256 || []), ...(entry.contentParts || []).flatMap(part => part.additionalCodeSha256 || [])]
      const reorganized = entry.contentParts || entry.codeReplacements || entry.additionalCodeSha256
      assert.deepEqual(reorganized ? hashes.sort() : hashes, reorganized ? expectedHashes.sort() : expectedHashes, `${entry.path}: upstream code changed`)
      assert.ok(headingCount >= entry.sourceHeadingCount, `${entry.path}: missing sections`)
    }
  }
})

test('Arch offers three privilege groups and two AUR helper groups in every locale', async () => {
  for (const locale of Object.values(locales)) {
    const page = await readFile(guideFile(locale, 'arch.md'), 'utf8')
    assert.equal((page.match(/::: code-group/g) || []).length, 5)
    assert.equal((page.match(/```shell \[sudo\]/g) || []).length, 3)
    assert.equal((page.match(/```shell \[yay\]/g) || []).length, 2)
    const restored = restoreCommandGroups(page)
    assert.ok(!restored.includes('::: code-group'))
    assert.ok(!page.includes('[yay/paru]'))
  }
})

const presentationTopics = [
  'user-guide/run-as-daemon', 'user-guide/build-by-yourself',
  'user-guide/reload-and-suspend', 'user-guide/kernel-parameters',
  'user-guide/kernel-upgrade', 'configuration/dns', 'configuration/routing',
  'configuration/separate-config', 'configuration/external-dns',
  'start/minimal-configuration'
]

test('presentation changes preserve command parity across locales and privilege tabs', async () => {
  const bodies = text => [...text.matchAll(/^[ \t]*```[^\n]*\n([\s\S]*?)^[ \t]*```/gm)]
    .map(match => match[1].trim())
  for (const topic of presentationTopics) {
    const source = await readFile(join(root, `docs/dae/en-US/${topic}.md`), 'utf8')
    for (const locale of Object.values(locales)) {
      const page = await readFile(join(root, `docs/dae/${locale.lang}/${topic}.md`), 'utf8')
      assert.deepEqual(bodies(page), bodies(source), `${locale.lang}/${topic}: code differs`)
      const pairs = [...page.matchAll(/```shell \[sudo\]\n([\s\S]*?)```\n\n[ \t]*```shell \[root\]\n([\s\S]*?)```/g)]
      for (const [, sudo, rootCommands] of pairs) {
        assert.equal(sudo.replace(/^(\s*)sudo /gm, '$1').replaceAll('| sudo ', '| '), rootCommands, topic)
      }
      assert.equal((page.match(/```shell \[sudo\]/g) || []).length, pairs.length, `${topic}: missing root counterpart`)
    }
  }
})

test('forwarding example writes both IP versions and reboot checks remain separate', async () => {
  const page = await readFile(join(root, 'docs/dae/en-US/user-guide/kernel-parameters.md'), 'utf8')
  const command = [...page.matchAll(/```shell \[root\]\n([\s\S]*?)```/g)]
    .map(match => match[1]).find(block => block.includes('60-ip-forward.conf'))
  const directory = await mkdtemp(join(tmpdir(), 'dae-forwarding-test-'))
  try {
    const output = join(directory, 'forward.conf')
    const isolated = command.replace('/etc/sysctl.d/60-ip-forward.conf', output).replace(/^sysctl --system\n/m, '')
    execFileSync('sh', ['-eu', '-c', isolated], { stdio: 'pipe' })
    assert.equal(await readFile(output, 'utf8'), 'net.ipv4.ip_forward = 1\nnet.ipv6.conf.all.forwarding = 1\n')
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
  const upgrade = await readFile(join(root, 'docs/dae/en-US/user-guide/kernel-upgrade.md'), 'utf8')
  assert.ok(!upgrade.includes('/etc/apt/sources.list/'))
  const unstable = [...upgrade.matchAll(/```shell \[root\]\n([\s\S]*?)```/g)]
    .map(match => match[1]).find(block => block.includes('# Add unstable source'))
  assert.ok(unstable.indexOf('apt update') > unstable.indexOf('Pin-Priority: 100'))
  assert.ok(unstable.indexOf('apt update') < unstable.indexOf('apt dist-upgrade'))
  for (const [, block] of upgrade.matchAll(/```shell[^\n]*\n([\s\S]*?)```/g)) {
    assert.ok(!(block.includes('reboot') && block.includes('uname -r')))
  }
})

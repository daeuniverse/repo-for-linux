import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { checkAnchors } from '../scripts/check-docs-anchors.mjs'

test('built HTML anchor check resolves routes, entities and encoded fragments and rejects missing targets', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'docs-anchors-'))
  try {
    await assert.rejects(checkAnchors(directory), /No built HTML pages/)
    await mkdir(join(directory, 'guide'))
    await writeFile(join(directory, 'index.html'), `
      <a href="guide/#%E4%B8%AD%E6%96%87">Chinese</a>
      <a href="guide/index.html?q=1&amp;x=2#one&amp;two">Entity</a>
      <a href="guide/index#legacy">Named anchor</a>
      <a href="https://elsewhere.example/#absent">External</a>
      <a href="#top">Top</a>
      <!-- <a href="#not-a-link">comment</a> -->
      <script>const fake = '<a href="#not-a-link">';</script>
    `)
    await writeFile(join(directory, 'guide/index.html'), '<h2 id="中文">中文</h2><h2 id="one&amp;two">Two</h2><a name="legacy"></a>')
    let result = await checkAnchors(directory, 'https://example.org/project/')
    assert.equal(result.checked, 3)
    assert.deepEqual(result.failures, [])
    await writeFile(join(directory, 'bad.html'), `
      <meta name="description"><div data-id="pretend"></div>
      <a href="#description">Metadata is not an anchor</a>
      <a href="#pretend">Data attributes are not ids</a>
      <a href="/project/guide/#absent">Missing fragment</a>
      <a href="/project/missing#absent">Missing page</a>
    `)
    result = await checkAnchors(directory, 'https://example.org/project/')
    assert.equal(result.failures.length, 4)
    assert.deepEqual(result.failures.map(link => link.fragment), ['description', 'pretend', 'absent', 'absent'])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

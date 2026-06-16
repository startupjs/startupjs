import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

test('plugin loads dashboard route lazily', async () => {
  const source = await readFile(join(__dirname, '../plugin.js'), 'utf8')

  assert.doesNotMatch(source, /import\s+initDashboardRoute\s+from/)
  assert.match(source, /await import\('\.\/initDashboardRoute\.js'\)/)
})

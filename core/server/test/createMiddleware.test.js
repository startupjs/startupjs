import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

test('createMiddleware keeps local middleware imports hidden from web static analysis', async () => {
  const source = await readFile(join(__dirname, '../server/createMiddleware.js'), 'utf8')

  assert.doesNotMatch(source, /import\s*\(\s*join/)
  assert.match(source, /return import\(specifier\)/)
})

test('server entry keeps server-only modules hidden from web static analysis', async () => {
  const source = await readFile(join(__dirname, '../index.js'), 'utf8')

  assert.doesNotMatch(source, /import\s*\(\s*['"]\.\/server\//)
  assert.match(source, /return import\(specifier\)/)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import * as fs from 'node:fs'
import { tmpdir } from 'node:os'
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm'
import express from 'express'
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

// Execute the unchanged production modules in an isolated VM. Only application
// registry/backend/session initialization and the lazy importer are substituted;
// Express, filesystem routing and fixture module imports are real.
async function fixture (t, rootOptions = {}, callOptions = {}, lowLevel = false) {
  const root = await mkdtemp(join(tmpdir(), 'startupjs-filesystem-api-'))
  await mkdir(join(root, 'server/api'), { recursive: true })
  await writeFile(join(root, 'package.json'), '{"type":"module"}')
  const effects = []
  const key = 'startupjsFixture' + root.split('/').pop()
  globalThis[key] = effects
  await writeFile(join(root, 'server/middleware.js'), `
    globalThis[${JSON.stringify(key)}].push('middleware-import')
    export default (req, res, next) => { req.fixtureMiddleware = true; next() }
  `)
  await writeFile(join(root, 'server/api/example.js'), `
    globalThis[${JSON.stringify(key)}].push('api-import')
    export const get = (req, res) => res.json({ handler: 'named', middleware: req.fixtureMiddleware })
    export default (req, res) => res.json({ handler: 'default' })
  `)
  t.after(async () => { delete globalThis[key]; await rm(root, { recursive: true, force: true }) })
  const probes = []
  const hooks = []
  const moduleOptions = { enableServer: true, ...rootOptions }
  const registry = {
    options: moduleOptions,
    models: {},
    reduceHook: () => undefined,
    hook (name, app) {
      hooks.push(name)
      if (name === 'api') app.get('/explicit', (req, res) => res.json({ explicit: true }))
      if (name === 'serverRoutes') app.get('/after', (req, res) => res.json({ after: true }))
    }
  }
  const backendOptions = []
  const context = createContext({ console, URL, process: { env: { ROOT_PATH: root }, cwd: () => root } })
  const cache = new Map()
  const synthetic = (id, exports) => {
    const m = new SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value)
    }, { context, identifier: id })
    return m
  }
  const backend = {
    createBackend: options => { backendOptions.push(options); return {} },
    initConnection: () => ({
      middleware: (req, res, next) => {
        if (req.headers['x-fixture-session']) req.session = {}
        next()
      }
    })
  }
  for (const name of ['mongo', 'mongoClient', 'createMongoIndex', 'redis', 'redlock', 'sqlite', 'Redis', 'getRedis', 'getRedisOptions', 'redisPrefix', 'generateRedisPrefix']) backend[name] = undefined
  const fsExports = {
    readFileSync: fs.readFileSync,
    existsSync: path => { probes.push(path); return fs.existsSync(path) },
    readdirSync: fs.readdirSync
  }
  async function load (file) {
    if (cache.has(file)) return cache.get(file)
    const source = await readFile(file, 'utf8')
    const m = new SourceTextModule(source, { context, identifier: file, initializeImportMeta: meta => { meta.url = new URL('file://' + file).href } })
    cache.set(file, m)
    await m.link(async specifier => {
      if (specifier === '@startupjs/registry') return synthetic(specifier, { ROOT_MODULE: registry })
      if (specifier === 'teamplay/server') return synthetic(specifier, backend)
      if (specifier === 'fs') return synthetic(specifier, fsExports)
      if (specifier.endsWith('dotenv.cjs') || specifier.endsWith('initServer.auto.js')) return synthetic(specifier, { default: undefined })
      if (specifier.endsWith('createSession.js')) return synthetic(specifier, { default: () => (req, res, next) => next() })
      const native = await import(specifier)
      return synthetic(specifier, { ...native })
    })
    await m.evaluate()
    return m
  }
  // The production new Function lazy import body is asserted rather than changed.
  context.Function = function (parameter, body) {
    assert.equal(parameter, 'specifier')
    assert.equal(body, 'return import(specifier)')
    return async specifier => {
      if (specifier.endsWith('/server/createMiddleware.js')) return (await load(join(__dirname, '../server/createMiddleware.js'))).namespace
      return import(specifier)
    }
  }
  let app
  if (lowLevel) {
    const m = await load(join(__dirname, '../server/createMiddleware.js'))
    app = express().use(await m.namespace._createMiddleware({ backend: {}, channel: backend.initConnection(), options: { dirname: root, ...callOptions } }))
  } else {
    const m = await load(join(__dirname, '../index.js'))
    app = (await m.namespace.createMiddleware({ dirname: root, ...callOptions })).middleware
  }
  const server = app.listen(0, '127.0.0.1')
  await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject) })
  t.after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())))
  async function request (path, method = 'GET', headers = {}) {
    const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, { method, headers })
    return { status: response.status, body: response.status === 200 ? await response.json() : undefined }
  }
  return { root, effects, probes, hooks, backendOptions, request }
}

for (const [name, rootOptions, callOptions] of [
  ['application false', { enableFilesystemApiRouting: false }, {}],
  ['caller false overrides application true', { enableFilesystemApiRouting: true }, { enableFilesystemApiRouting: false }]
]) {
  test(`filesystem API opt-out: ${name} prevents probes and eager imports`, async t => {
    const f = await fixture(t, rootOptions, callOptions)
    assert.equal(f.probes.includes(join(f.root, 'server/api')), false)
    assert.deepEqual(f.effects, ['middleware-import'])
    assert.deepEqual(await f.request('/explicit'), { status: 200, body: { explicit: true } })
    assert.equal((await f.request('/api/example')).status, 404)
    assert.equal((await f.request('/after')).status, 200)
    assert.equal(f.backendOptions[0].enableFilesystemApiRouting, false)
    assert.deepEqual(f.hooks, ['backend', 'beforeSession', 'session', 'afterSession', 'middleware', 'api', 'serverRoutes'])
  })
}

for (const [name, rootOptions, callOptions] of [
  ['omitted defaults true', {}, {}],
  ['explicit true', {}, { enableFilesystemApiRouting: true }],
  ['caller true overrides application false', { enableFilesystemApiRouting: false }, { enableFilesystemApiRouting: true }]
]) {
  test(`filesystem API compatibility: ${name} preserves named and default handlers`, async t => {
    const f = await fixture(t, rootOptions, callOptions)
    assert.deepEqual(f.effects, ['middleware-import', 'api-import'])
    assert.equal(f.probes.includes(join(f.root, 'server/api')), true)
    assert.deepEqual(await f.request('/api/example'), { status: 200, body: { handler: 'named', middleware: true } })
    assert.deepEqual(await f.request('/api/example', 'POST'), { status: 200, body: { handler: 'default' } })
    assert.equal(f.backendOptions[0].enableFilesystemApiRouting, true)
    assert.equal((await f.request('/explicit')).status, 200)
  })
}

test('low-level omitted option retains filesystem API routing', async t => {
  const f = await fixture(t, {}, {}, true)
  assert.equal((await f.request('/api/example')).status, 200)
  assert.deepEqual(f.effects, ['middleware-import', 'api-import'])
})

test('broad enableServer false remains authoritative even with filesystem option true', async t => {
  const f = await fixture(t, { enableServer: false }, { enableFilesystemApiRouting: true })
  assert.equal(f.probes.includes(join(f.root, 'server/api')), false)
  assert.deepEqual(f.effects, ['middleware-import'])
  assert.equal((await f.request('/explicit')).status, 200)
})

test('OAuth session admission and explicit serverRoutes survive filesystem opt-out', async t => {
  const f = await fixture(t, { enableOAuth2: true }, { enableFilesystemApiRouting: false })
  assert.equal((await f.request('/explicit')).status, 404)
  assert.equal((await f.request('/explicit', 'GET', { 'x-fixture-session': 'present' })).status, 200)
  assert.equal((await f.request('/after')).status, 200)
  assert.equal(f.probes.includes(join(f.root, 'server/api')), false)
  assert.deepEqual(f.effects, ['middleware-import'])
})

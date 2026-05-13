import { AsyncLocalStorage } from 'node:async_hooks'
import { existsSync, readFileSync } from 'node:fs'
import Module, { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { Readable } from 'node:stream'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const STORE = new AsyncLocalStorage()

export default function createExpoRouterMiddleware ({ build, environment }) {
  const {
    createRequestHandler: createExpoHandler
  } = requireExpoServer('expo-server/vendor/abstract')
  const { createEnvironment } = requireExpoServer('expo-server/vendor/environment/common')
  const { createNodeRequestScope } = requireExpoServer('expo-server/vendor/environment/node')
  const { respond } = requireExpoServer('expo-server/adapter/express')

  const run = createNodeRequestScope(STORE, { build, environment })
  const onRequest = createExpoHandler(createExpoEnvironment({ build, createEnvironment }))

  return async function expoRouterMiddleware (req, res, next) {
    if (!req?.url || !req.method) return next()

    try {
      const request = convertRequest(req, res)
      exposeExpressContext(request, req, res)
      const response = await run(onRequest, request)
      await respond(res, response, { signal: request.signal })
    } catch (err) {
      next(err)
    }
  }
}

function createExpoEnvironment ({ build, createEnvironment }) {
  const moduleCache = new Map()

  async function readText (request) {
    const filePath = join(build, request)
    if (!existsSync(filePath)) return null
    return readFileSync(filePath, 'utf8')
  }

  async function readJson (request) {
    const json = await readText(request)
    return json == null ? null : JSON.parse(json)
  }

  async function loadModule (request) {
    const filePath = join(build, request)
    if (!existsSync(filePath)) return null
    if (/\.mjs$/.test(filePath)) return import(pathToFileURL(filePath).href)
    return loadCommonJsModule(filePath, moduleCache)
  }

  return createEnvironment({
    readText,
    readJson,
    loadModule
  })
}

function loadCommonJsModule (filePath, moduleCache) {
  if (moduleCache.has(filePath)) return moduleCache.get(filePath).exports

  const mod = new Module(filePath)
  moduleCache.set(filePath, mod)
  mod.filename = filePath
  mod.paths = Module._nodeModulePaths(dirname(filePath))
  mod._compile(readFileSync(filePath, 'utf8'), filePath)
  return mod.exports
}

function requireExpoServer (id) {
  try {
    return require(id)
  } catch (err) {
    throw Error(ERRORS.missingExpoServer(id, err))
  }
}

function convertRequest (req, res) {
  const url = new URL(req.originalUrl || req.url, getRequestOrigin(req))
  const controller = new AbortController()

  res.once('close', () => controller.abort())
  res.once('error', err => controller.abort(err))
  req.once('error', err => controller.abort(err))

  const init = {
    method: req.method,
    headers: convertRawHeaders(req.rawHeaders),
    signal: controller.signal
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const body = getRequestBody(req)
    if (body != null) init.body = body
    init.duplex = 'half'
  }

  return new Request(url.href, init)
}

function getRequestOrigin (req) {
  const protocol = req.protocol || (req.socket?.encrypted ? 'https' : 'http')
  const host = req.headers.host || 'localhost'
  return `${protocol}://${host}`
}

function convertRawHeaders (requestHeaders = []) {
  const headers = new Headers()
  for (let index = 0; index < requestHeaders.length; index += 2) {
    headers.append(requestHeaders[index], requestHeaders[index + 1])
  }
  return headers
}

function getRequestBody (req) {
  if (req.rawBody != null) return req.rawBody
  if (req.readableEnded) return serializeParsedBody(req)
  return Readable.toWeb(req)
}

function serializeParsedBody (req) {
  if (req.body == null) return
  if (
    typeof req.body === 'string' ||
    req.body instanceof URLSearchParams ||
    Buffer.isBuffer(req.body)
  ) {
    return req.body
  }
  return JSON.stringify(req.body)
}

function exposeExpressContext (request, req, res) {
  const context = { req, res, session: req.session }
  Object.defineProperties(request, {
    express: {
      configurable: true,
      value: { req, res }
    },
    session: {
      configurable: true,
      value: req.session
    },
    startupjs: {
      configurable: true,
      value: context
    }
  })
}

const ERRORS = {
  missingExpoServer: (id, err) => `
    [@startupjs/server] Expo Router server output was detected, but \`${id}\` could not be loaded.
    Install \`expo-server\` in the Expo app or use Expo Router SDK 54+.

    Original error:
    ${err?.message || err}
  `
}

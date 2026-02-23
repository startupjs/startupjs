/* eslint-disable import-helpers/order-imports */
// IMPORTANT! dotenv import must go first
import dummyDotenv from './dotenv.cjs'

import { resolve } from 'path'
import dummyInitServer from './initServer.auto.js'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import _createSession from './server/createSession.js'
import { createBackend as _createBackend, initConnection as _initConnection } from 'teamplay/server'
import { readFileSync } from 'fs'

const IS_EXPO = isExpo(process.env.ROOT_PATH || process.cwd())

// TODO: ATM fetchOnly is not working correctly since it doesn't re-fetch data
//       whenever sub() fires. Because of this for now we let the actual
//       subscriptions run on the server even though it's probably not optimal.
//       One can argue though that having subscriptions running on server
//       might actually be good for performance since the data is cached
//       between concurrent requests and we don't have to re-fetch it each time.
const FETCH_ONLY = false

const defaultOptions = {
  publicPath: IS_EXPO ? './dist' : './public',
  loginUrl: '/login',
  bodyParserLimit: '10mb',
  secure: false,
  dirname: process.env.ROOT_PATH || process.cwd(),
  isExpo: IS_EXPO
}

let backendInitialized = false

export default async function startServer (options) {
  const props = await createServer(options)
  return await new Promise((resolve, reject) => {
    props.server.listen(err => {
      if (err) return reject(err)
      resolve(props)
    })
  })
}

export async function createServer (options = {}) {
  const { default: createServer } = await import('./server/createServer.js')
  options = transformOptions(options)
  const backend = _createBackend({ ...options, models: MODULE.models })
  MODULE.hook('backend', backend)
  const sessionRef = {}
  if (!options.enableOAuth2) sessionRef.session = _createSession(options)
  const authorize = MODULE.reduceHook('authorizeConnection')
  const channel = _initConnection(backend, { ...sessionRef, fetchOnly: FETCH_ONLY, authorize })
  markBackendInitialized()
  const { server, expressApp } = await createServer({ backend, channel, options, ...sessionRef })
  return { server, backend, channel, expressApp, ...sessionRef }
}

export async function createMiddleware (options = {}) {
  const { default: createMiddleware } = await import('./server/createMiddleware.js')
  options = transformOptions(options)
  const backend = _createBackend({ ...options, models: MODULE.models })
  MODULE.hook('backend', backend)
  const sessionRef = {}
  if (!options.enableOAuth2) sessionRef.session = _createSession(options)
  const authorize = MODULE.reduceHook('authorizeConnection')
  const channel = _initConnection(backend, { ...sessionRef, fetchOnly: FETCH_ONLY, authorize })
  markBackendInitialized()
  const middleware = await createMiddleware({ backend, channel, options, ...sessionRef })
  return { middleware, backend, channel, ...sessionRef }
}

export function createBackend (options = {}) {
  options = transformOptions(options)
  const backend = _createBackend({ ...options, models: MODULE.models })
  MODULE.hook('backend', backend)
  _initConnection(backend, { fetchOnly: FETCH_ONLY })
  markBackendInitialized()
  return backend
}

export function isBackendInitialized () {
  return backendInitialized
}

function transformOptions (options = {}) {
  options = { ...defaultOptions, ...MODULE.options, ...options }

  // Transform public path to be absolute
  options.publicPath = resolve(options.dirname, options.publicPath)

  return options
}

function isExpo (rootPath) {
  const packageJson = readFileSync(resolve(rootPath, './package.json'), 'utf8')
  const { dependencies = {} } = JSON.parse(packageJson)
  return Boolean(dependencies.expo)
}

function markBackendInitialized () {
  backendInitialized = true
}

export {
  mongo,
  mongoClient,
  createMongoIndex,
  redis,
  redlock,
  sqlite,
  Redis,
  getRedis,
  getRedisOptions,
  redisPrefix,
  generateRedisPrefix
} from 'teamplay/server'

export function NO_DEAD_CODE_ELIMINATION () {
  return [dummyDotenv, dummyInitServer]
}

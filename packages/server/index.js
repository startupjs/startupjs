/* eslint-disable import-helpers/order-imports */
// IMPORTANT! nconf import must go first
import dummyNconf from './nconf.js'

import { resolve } from 'path'
import { EventEmitter } from 'events'
import dummyInitServer from './initServer.auto.js'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import _createBackend from '@startupjs/backend'
import _createSession from './server/createSession.js'
import _createChannel from '@startupjs/channel/server'
import { readFileSync } from 'fs'

const IS_EXPO = isExpo(process.env.ROOT_PATH || process.cwd())

const defaultOptions = {
  publicPath: IS_EXPO ? './dist' : './public',
  loginUrl: '/login',
  bodyParserLimit: '10mb',
  secure: false,
  dirname: process.env.ROOT_PATH || process.cwd(),
  isExpo: IS_EXPO
}

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
  const backend = _createBackend(options)
  const session = _createSession(options)
  const channel = _createChannel(backend, { session })
  const { server, expressApp } = await createServer({ backend, session, channel, options })
  return { server, backend, session, channel, expressApp }
}

export async function createMiddleware (options = {}) {
  const { default: createMiddleware } = await import('./server/createMiddleware.js')
  options = transformOptions(options)
  const backend = _createBackend(options)
  const session = _createSession(options)
  const channel = _createChannel(backend, { session })
  const middleware = await createMiddleware({ backend, session, channel, options })
  return { middleware, backend, session, channel }
}

export function createBackend (options = {}) {
  options = transformOptions(options)
  const backend = _createBackend(options)
  return backend
}

function transformOptions (options = {}) {
  options = { ...defaultOptions, ...MODULE.options, ...options }

  // Transform public path to be absolute
  options.publicPath = resolve(options.dirname, options.publicPath)

  // DEPRECATED. Use hooks system (plugins) instead of EventEmitter
  options.ee = new EventEmitter()

  return options
}

function isExpo (rootPath) {
  const packageJson = readFileSync(resolve(rootPath, './package.json'), 'utf8')
  const { dependencies = {} } = JSON.parse(packageJson)
  return Boolean(dependencies.expo)
}

export { mongo, mongoClient, createMongoIndex, redis, redlock, sqlite } from '@startupjs/backend'

export function NO_DEAD_CODE_ELIMINATION () {
  return [dummyNconf, dummyInitServer]
}

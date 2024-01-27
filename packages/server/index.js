/* eslint-disable import-helpers/order-imports */
// IMPORTANT! nconf import must go first
import dummyNconf from './nconf.js'

import { resolve } from 'path'
import { EventEmitter } from 'events'
import dummyLoadConfig from '@startupjs/registry/loadStartupjsConfig.auto'
import createBackend from '@startupjs/backend'
import createSession from './server/createSession.js'
import createChannel from '@startupjs/channel/server'

export { mongo, mongoClient, createMongoIndex, redis, redlock } from '@startupjs/backend'

const defaultOptions = {
  publicPath: './public',
  loginUrl: '/login',
  bodyParserLimit: '10mb',
  secure: false,
  dirname: process.env.ROOT_PATH || process.cwd()
}

export default async function startServer (options) {
  const props = await createServer(options)
  return new Promise((resolve, reject) => {
    props.server.listen(err => {
      if (err) return reject(err)
      resolve(props)
    })
  })
}

export async function createServer (options = {}) {
  let backend, session, channel
  ({ backend, session, channel, options } = commonInit(options))
  const { default: createServer } = await import('./server/createServer.js')
  const { server, expressApp } = createServer({ backend, session, channel, options })
  return { server, backend, session, channel, expressApp }
}

export async function createMiddleware (options = {}) {
  let backend, session, channel
  ({ backend, session, channel, options } = commonInit(options))
  const { default: createMiddleware } = await import('./server/createMiddleware.js')
  const middleware = createMiddleware({ backend, session, channel, options })
  return { middleware, backend, session, channel }
}

function commonInit (options = {}) {
  options = { ...defaultOptions, ...options }

  // Transform public path to be absolute
  options.publicPath = resolve(options.dirname, options.publicPath)

  // DEPRECATED. Use hooks system (plugins) instead of EventEmitter
  options.ee = new EventEmitter()

  const backend = createBackend(options)
  const session = createSession(options)
  const channel = createChannel(backend, { session })

  return { backend, channel, session, options }
}

;((...args) => {})(dummyNconf, dummyLoadConfig) // prevent dead code elimination

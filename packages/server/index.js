// IMPORTANT! nconf import must go first
import dummyNconf from './nconf.js' // eslint-disable-line

import path from 'path'
import { EventEmitter } from 'events'

export { mongo, mongoClient, createMongoIndex, redis, redlock } from '@startupjs/backend'

const defaultOptions = {
  publicPath: './public',
  loginUrl: '/login',
  bodyParserLimit: '10mb',
  secure: true,
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
  ({ backend, session, channel, options } = await commonInit(options))
  const { default: createServer } = await import('./server/createServer.js')
  const { server, expressApp } = createServer({ backend, session, channel, options })
  return { server, backend, session, channel, expressApp }
}

export async function createMiddleware (options = {}) {
  let backend, session, channel
  ({ backend, session, channel, options } = await commonInit(options))
  const { default: createMiddleware } = await import('./server/createMiddleware.js')
  const middleware = createMiddleware({ backend, session, channel, options })
  return { middleware, backend, session, channel }
}

async function commonInit (options = {}) {
  options = { ...defaultOptions, ...options }

  // Transform public path to be absolute
  options.publicPath = path.resolve(options.dirname, options.publicPath)

  // DEPRECATED. Use hooks system (plugins) instead of EventEmitter
  options.ee = new EventEmitter()

  const [
    { default: createBackend },
    { default: createSession },
    { default: createChannel }
  ] = await Promise.all([
    import('@startupjs/backend'),
    import('./server/createSession.js'),
    import('@startupjs/channel/server')
  ])
  const backend = await createBackend(options)
  const session = createSession(options)
  const channel = createChannel(backend, { session })

  return { backend, channel, session, options }
}

;((...args) => {})(dummyNconf) // prevent dead code elimination

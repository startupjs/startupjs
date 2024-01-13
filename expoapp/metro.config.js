const { getDefaultConfig } = require('startupjs/metro-config')
const { resolve } = require('path')
const connect = require('connect')

const config = getDefaultConfig(__dirname)

config.watchFolders = [resolve(__dirname, '../')]
config.resolver.nodeModulesPaths = [
  resolve(__dirname, 'node_modules'),
  resolve(__dirname, '../node_modules')
]
config.server.enhanceMiddleware = (metroMiddleware) => {
  return connect()
    .use(metroMiddleware)
    .use((req, res, next) => {
      if (req.url === '/test-url') {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Hello from test')
      } else {
        next()
      }
    })
    .use(startupjsMiddleware)
}

module.exports = config

function startupjsMiddleware (req, res, next) {
  const middleware = getStartupjsMiddleware()
  if (middleware) {
    middleware.apply(this, arguments)
  } else {
    next()
  }
}

let middlewareInstance
function getStartupjsMiddleware () {
  if (middlewareInstance?.then) return
  if (middlewareInstance) return middlewareInstance
  middlewareInstance = (async () => {
    const { createMiddleware } = await import('@startupjs/server')
    const { middleware } = await createMiddleware()
    middlewareInstance = middleware
  })()
}

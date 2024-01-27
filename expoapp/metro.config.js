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
    .use(getStartupjsMiddleware())
}

module.exports = config

function getStartupjsMiddleware () {
  const middleware = (async () => {
    await import('startupjs/nodeRegister')
    const { createMiddleware } = await import('startupjs/server')
    return (await createMiddleware()).middleware
  })()
  return function startupjsMiddleware (req, res, next) {
    (async () => {
      try {
        (await middleware).apply(this, arguments)
      } catch (err) {
        next(err)
      }
    })()
  }
}

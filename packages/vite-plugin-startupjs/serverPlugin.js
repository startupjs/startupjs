const fs = require('fs')

exports.SERVICE_MODULE_PREFIX = '/@startupjs-build/'

exports.isServiceModule = (path) => {
  return path.indexOf(exports.SERVICE_MODULE_PREFIX) === 0
}

exports.generateServiceModule = (modulePath) => {
  return exports.SERVICE_MODULE_PREFIX + modulePath
}

exports.getServiceModule = (path) => {
  path = path.replace(exports.SERVICE_MODULE_PREFIX, '')
  const filepath = require.resolve(path)
  return fs.readFileSync(filepath, 'utf-8')
}

exports.startupjsServerPlugin = function startupjsServerPlugin ({ app }) {
  app.use(async (ctx, next) => {
    // serve react refresh runtime
    if (exports.isServiceModule(ctx.path)) {
      ctx.type = 'js'
      ctx.status = 200
      ctx.body = exports.getServiceModule(ctx.path)
      return
    }

    await next()
  })
}

const getConfig = require('dm-bundler/webpack.server.config')

module.exports = getConfig(undefined, {
  forceCompileModules: ['startupjs/init'],
  alias: {}
})

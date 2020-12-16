const getConfig = require('startupjs/bundler/webpack.server.config.cjs')

module.exports = getConfig(undefined, {
  forceCompileModules: [],
  alias: {}
})

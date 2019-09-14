const getConfig = require('startupjs/bundler').webpackServerConfig

module.exports = getConfig(undefined, {
  forceCompileModules: [],
  alias: {}
})

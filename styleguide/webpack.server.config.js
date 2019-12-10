const getConfig = require('startupjs/bundler').webpackServerConfig

module.exports = getConfig(undefined, {
  modulesDir: '../node_modules',
  forceCompileModules: [],
  alias: {}
})

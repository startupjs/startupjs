const getConfig = require('startupjs/bundler').webpackWebConfig

module.exports = getConfig(undefined, {
  forceCompileModules: [],
  alias: {}
})

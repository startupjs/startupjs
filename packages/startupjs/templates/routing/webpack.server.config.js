const getConfig = require('startupjs/bundler').webpackServerConfig

module.exports = getConfig(undefined, {
  forceCompileModules: [
    '@startupjs/app/server'
  ],
  alias: {}
})

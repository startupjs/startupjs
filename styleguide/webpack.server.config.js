const getConfig = require('startupjs/bundler').webpackServerConfig
const PROD = !process.env.WEBPACK_DEV

module.exports = getConfig(undefined, {
  modulesDir: PROD ? 'node_modules' : '../node_modules',
  forceCompileModules: [],
  alias: {}
})

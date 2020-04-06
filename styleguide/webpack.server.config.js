const getConfig = require('startupjs/bundler').webpackServerConfig
// TODO: In future if styleguide is deployed separately from the monorepo
//       this might be needed to use either node_modules or ../node_modules
// const PROD = !process.env.WEBPACK_DEV

module.exports = getConfig(undefined, {
  modulesDir: '../node_modules',
  forceCompileModules: [],
  alias: {}
})

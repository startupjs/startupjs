const getConfig = require('startupjs/bundler.cjs').webpackServerConfig
// TODO: In future if styleguide is deployed separately from the monorepo
//       this might be needed to use either node_modules or ../node_modules
// const PROD = !process.env.WEBPACK_DEV

module.exports = getConfig(undefined, {
  modulesDir: '../node_modules',
  forceCompileModules: [
    '@startupjs/auth/server',
    '@startupjs/auth/isomorphic',
    '@startupjs/auth-apple/server',
    '@startupjs/auth-azuread/server',
    '@startupjs/auth-facebook/server',
    '@startupjs/auth-google/server',
    '@startupjs/auth-linkedin/server',
    '@startupjs/auth-local/server'
  ],
  alias: {}
})

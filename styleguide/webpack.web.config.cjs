const getConfig = require('startupjs/bundler/webpack.web.config.cjs')

module.exports = getConfig(undefined, {
  forceCompileModules: [
    '@startupjs/auth',
    '@startupjs/auth-apple',
    '@startupjs/auth-azuread',
    '@startupjs/auth-facebook',
    '@startupjs/auth-google',
    '@startupjs/auth-linkedin',
    '@startupjs/auth-local',
    '@startupjs/auth-common',
    '@startupjs/auth-idg'
  ],
  mode: 'react-native'
})

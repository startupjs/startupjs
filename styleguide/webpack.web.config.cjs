const getConfig = require('startupjs/bundler.cjs').webpackWebConfig

module.exports = getConfig(undefined, {
  forceCompileModules: [
    'react-native-collapsible',
    '@startupjs/ui',
    '@startupjs/auth',
    '@startupjs/auth-apple',
    '@startupjs/auth-azuread',
    '@startupjs/auth-facebook',
    '@startupjs/auth-google',
    '@startupjs/auth-linkedin',
    '@startupjs/auth-local'
  ],
  mode: 'react-native'
})

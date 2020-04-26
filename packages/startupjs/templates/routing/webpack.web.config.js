const getConfig = require('startupjs/bundler').webpackWebConfig

module.exports = getConfig(undefined, {
  forceCompileModules: [
    '@startupjs/app'
  ],
  alias: {},
  mode: 'react-native'
})

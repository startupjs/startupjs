const getConfig = require('startupjs/bundler').webpackWebConfig

module.exports = getConfig(undefined, {
  forceCompileModules: [
    '@startupjs/app',
    'react-router-native-stack'
  ],
  alias: {}
})

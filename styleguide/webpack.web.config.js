const getConfig = require('startupjs/bundler').webpackWebConfig

module.exports = getConfig(undefined, {
  forceCompileModules: [
    '@startupjs/app',
    'react-router-native-stack',
    'react-native-drawer-layout-polyfill'
  ]
})

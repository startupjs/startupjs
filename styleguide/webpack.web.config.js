const getConfig = require('startupjs/bundler').webpackWebConfig

module.exports = getConfig(undefined, {
  forceCompileModules: [
    'react-native-collapsible',
    '@startupjs/ui'
  ],
  mode: 'react-native'
})

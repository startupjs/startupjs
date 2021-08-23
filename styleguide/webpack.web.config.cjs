const getConfig = require('startupjs/bundler/webpack.web.config.cjs')

module.exports = getConfig(undefined, {
  forceCompileModules: [
    'react-native-webview'
  ],
  mode: 'react-native'
})

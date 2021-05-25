const getConfig = require('startupjs/bundler/webpack.web.config.cjs')

module.exports = getConfig(undefined, {
  forceCompileModules: [],
  mode: 'react-native'
})

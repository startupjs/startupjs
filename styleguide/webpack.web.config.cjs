const getConfig = require('startupjs/bundler/webpack.web.config.cjs')

module.exports = getConfig(undefined, {
  forceCompileModules: [
    '@ptomasroos/react-native-multi-slider'
  ],
  mode: 'react-native'
})

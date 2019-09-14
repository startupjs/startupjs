const getConfig = require('dm-bundler/webpack.web.config')

module.exports = getConfig(undefined, {
  forceCompileModules: ['startupjs/init'],
  alias: {}
})

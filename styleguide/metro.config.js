const path = require('path')
const config = require('startupjs/bundler').metroConfig

config.watchFolders = [
  path.resolve(__dirname, '../'),
  path.resolve(__dirname, '../node_modules')
]

config.resolver.sourceExts = config.resolver.sourceExts.concat([
  'ts',
  'tsx'
])

module.exports = config

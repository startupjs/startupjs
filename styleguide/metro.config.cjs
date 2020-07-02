const path = require('path')
const config = require('startupjs/bundler.cjs').metroConfig

config.watchFolders = [
  path.resolve(__dirname, '../'),
  path.resolve(__dirname, '../node_modules')
]

module.exports = config

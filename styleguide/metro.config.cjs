const config = require('startupjs/bundler/metro.config.cjs')
const path = require('path')

config.watchFolders = [
  path.resolve(__dirname, '../'),
  path.resolve(__dirname, '../node_modules')
]

module.exports = config

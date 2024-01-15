const { getDefaultConfig } = require('startupjs/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

config.watchFolders = [
  path.resolve(__dirname, '../'),
  path.resolve(__dirname, '../node_modules')
]

module.exports = config

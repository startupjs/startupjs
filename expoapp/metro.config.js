const { getDefaultConfig } = require('startupjs/metro-config')
const { resolve } = require('path')

const config = getDefaultConfig(__dirname)

config.watchFolders = [resolve(__dirname, '../')]
config.resolver.nodeModulesPaths = [
  resolve(__dirname, 'node_modules'),
  resolve(__dirname, '../node_modules')
]

module.exports = config

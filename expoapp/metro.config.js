const { resolve } = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname, { isCSSEnabled: false })

config.resolver.sourceExts.push('md', 'mdx', 'css', 'styl', 'yaml', 'yml')
config.transformer.babelTransformerPath = require.resolve('./metro.transformer.js')

config.watchFolders = [resolve(__dirname, '../')]
config.resolver.nodeModulesPaths = [
  resolve(__dirname, 'node_modules'),
  resolve(__dirname, '../node_modules')
]

module.exports = config

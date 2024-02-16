const { getDefaultConfig } = require('expo/metro-config')
const config = getDefaultConfig(__dirname)

const sourceExts = ['md', 'mdx', 'css', 'styl', 'json', 'svg']

config.resolver.sourceExts = config.resolver.sourceExts.concat(sourceExts)
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg')
config.transformer.babelTransformerPath = require.resolve('@startupjs/bundler/lib/rnTransformer')

module.exports = config

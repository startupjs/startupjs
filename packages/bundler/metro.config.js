const { getDefaultConfig } = require('@expo/metro-config')
const defaultConfig = getDefaultConfig(__dirname)
const defaultAssetExts = defaultConfig.resolver.assetExts

const EXTENSIONS = ['js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx', 'md', 'mdx', 'css', 'styl', 'json', 'svg']

defaultConfig.resolver.assetExts = defaultAssetExts.filter(ext => ext !== 'svg')
defaultConfig.resolver.sourceExts = EXTENSIONS
defaultConfig.transformer.babelTransformerPath = require.resolve('@startupjs/bundler/lib/rnTransformer')

module.exports = defaultConfig

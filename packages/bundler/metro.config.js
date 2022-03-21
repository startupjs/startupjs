const { getDefaultConfig } = require('@expo/metro-config')
const defaultConfig = getDefaultConfig(__dirname)
const defaultAssetExts = defaultConfig.resolver.assetExts
// NOTE: What about json ext?
const EXTENSIONS = ['js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx', 'md', 'mdx', 'css', 'styl', 'svg']

defaultConfig.resolver.assetExts = defaultAssetExts.filter(ext => ext !== 'svg')
defaultConfig.resolver.sourceExts = EXTENSIONS
defaultConfig.transformer.babelTransformerPath = require.resolve('@startupjs/bundler/lib/rnTransformer')

module.exports = defaultConfig

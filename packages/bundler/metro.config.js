const defaultAssetExts = require('metro-config/src/defaults/defaults').assetExts

const EXTENSIONS = ['js', 'jsx', 'json', 'mjs', 'cjs', 'ts', 'tsx', 'md', 'mdx', 'css', 'styl', 'svg']

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    }),
    babelTransformerPath: require.resolve('./lib/rnTransformer')
  },
  resolver: {
    assetExts: defaultAssetExts.filter(ext => ext !== 'svg'),
    sourceExts: EXTENSIONS
  }
}

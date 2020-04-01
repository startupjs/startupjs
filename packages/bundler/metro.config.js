const defaultAssetExts = require('metro-config/src/defaults/defaults').assetExts

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
    sourceExts: [
      'js',
      'jsx',
      'ts',
      'tsx',
      'md',
      'mdx',
      'css',
      'styl',
      'svg'
    ]
  }
}

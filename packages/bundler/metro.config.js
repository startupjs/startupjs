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
    sourceExts: [
      'js',
      'jsx',
      'ts',
      'tsx',
      'css',
      // TODO: 'sass',
      'styl'
    ]
  }
}

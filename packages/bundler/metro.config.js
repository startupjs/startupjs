module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    babelTransformerPath: require.resolve('./lib/rnTransformer')
  },
  resolver: {
    sourceExts: [
      'js',
      'jsx',
      // TODO: 'css',
      // TODO: 'sass',
      'styl'
    ]
  }
}

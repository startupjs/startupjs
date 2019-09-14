module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    babelTransformerPath: require.resolve('react-native-stylus-transformer')
  },
  resolver: {
    sourceExts: ['js', 'jsx', 'styl']
  }
}

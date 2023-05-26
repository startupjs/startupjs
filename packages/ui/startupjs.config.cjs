module.exports = {
  type: 'plugin',
  bundler: {
    forceCompile: {
      web: [
        '@ptomasroos/react-native-multi-slider',
        '@startupjs/ui'
      ],
      server: true
    }
  }
}

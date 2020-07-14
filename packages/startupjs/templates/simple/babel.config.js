// FIXME: We can't use .cjs, because .js externtion harcoded in metro.
// Also we can't use .js which require .cjs,
// because babel throw an error "Multiple configuration files found. Please remove one"
// https://github.com/facebook/metro/blob/0603ab1cd462205ddef062ba359c7b208b3fb81e/packages/metro-react-native-babel-transformer/src/index.js#L79

module.exports = {
  presets: [
    ['startupjs/babel.cjs', {
      alias: {}
    }]
  ]
}

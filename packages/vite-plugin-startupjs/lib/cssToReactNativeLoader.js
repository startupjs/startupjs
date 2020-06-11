// ref: https://github.com/kristerkari/react-native-css-transformer
const css2rn = require('css-to-react-native-transform').default

module.exports = function cssToReactNative (source) {
  const cssObject = css2rn(source, { parseMediaQueries: true })
  return 'module.exports = ' + JSON.stringify(cssObject)
}

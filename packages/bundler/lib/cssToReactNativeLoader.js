// ref: https://github.com/kristerkari/react-native-css-transformer
const css2rn = require('@startupjs/css-to-react-native-transform').default

// TODO: Fix parsing rgba() colors from stylus. For some reason they are (null)
module.exports = function cssToReactNative (source) {
  // TODO: Preprocess :export properties to put their values in quotes
  const cssObject = css2rn(source, { parseMediaQueries: true, parsePartSelectors: true })
  for (const key in cssObject.__exportProps || {}) {
    cssObject[key] = parseStylValue(cssObject.__exportProps[key])
  }
  return 'module.exports = ' + JSON.stringify(cssObject)
}

function parseStylValue (value) {
  if (typeof value !== 'string') return value
  // strip single quotes (stylus adds it for the topmost value)
  // and parens (stylus adds them for values in a hash)
  if (/^['"(]/.test(value)) {
    value = value.replace(/(?:^['"(]+|['")]+$)/g, '')
  }
  // hash
  if (value.charAt(0) === '{') {
    const hash = JSON.parse(value)
    for (const key in hash) {
      hash[key] = parseStylValue(hash[key])
    }
    return hash
  } else if (!isNaN(parseFloat(value))) {
    return parseFloat(value)
  } else {
    return value
  }
}

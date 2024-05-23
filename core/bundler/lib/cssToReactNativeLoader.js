// ref: https://github.com/kristerkari/react-native-css-transformer
const css2rn = require('@startupjs/css-to-react-native-transform').default

const EXPORT_REGEX = /:export\s*\{/

module.exports = function cssToReactNative (source) {
  source = escapeExport(source)
  const cssObject = css2rn(source, { parseMediaQueries: true, parsePartSelectors: true })
  for (const key in cssObject.__exportProps || {}) {
    cssObject[key] = parseStylValue(cssObject.__exportProps[key])
  }
  // save hash to use with the caching system of @startupjs/cache
  cssObject.__hash__ = simpleNumericHash(JSON.stringify(cssObject))
  return 'module.exports = ' + JSON.stringify(cssObject)
}

function parseStylValue (value) {
  if (typeof value !== 'string') return value
  // strip single quotes (stylus adds it for the topmost value)
  // and parens (stylus adds them for values in a hash)
  // Instead of doing a simple regex replace for both beginning and end,
  // we only find beginning chars and then cut string from both sides.
  // This is needed to prevent false-replacing the paren at the end of
  // values like 'rgba(...)'
  if (/^['"(]/.test(value)) {
    const wrapsLength = value.match(/^['"(]+/)[0].length
    value = value.slice(wrapsLength).slice(0, -wrapsLength)
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

// Process :export properties by wrapping their values in quotes
function escapeExport (source) {
  const match = source.match(EXPORT_REGEX)
  if (!match) return source

  // 1. find closing bracket of :export { ... }
  const matchIndex = match.index
  const matchStr = match[0]
  const matchLength = matchStr.length
  const start = matchIndex + matchLength
  let openBr = 1 // Count opened brackets, we start from one already opened
  let end

  for (let i = start; i < source.length; i++) {
    if (source.charAt(i) === '}') {
      --openBr
    } else if (source.charAt(i) === '{') {
      ++openBr
    }

    if (openBr <= 0) {
      end = i
      break
    }
  }
  if (!end) return source

  // 2. escape all exported values
  const properties = source
    .slice(start, end)
    .split(';')
    .map(line => line.replace(/(:\s+)([^'"].*[^'"])$/, '$1\'$2\''))
    .join(';')

  source = source.slice(0, start) + properties + source.slice(end)

  return source
}

// ref: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0?permalink_comment_id=2694461#gistcomment-2694461
function simpleNumericHash (s) {
  for (var i = 0, h = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}

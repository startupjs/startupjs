const callLoader = require('./lib/callLoader')
const stylusToCssLoader = require('./lib/stylusToCssLoader')
const cssToReactNativeLoader = require('./lib/cssToReactNativeLoader')
const nodePath = require('path')

module.exports = {
  // TODO VITE figure out what this proxy is about
  test: (path, query) => {
    if (query && query['commonjs-proxy'] != null) return false
    return /\.styl$/.test(path)
  },
  transform: (code, _, isBuild, path) => {
    let filename
    if (/^\/@modules\//.test(path)) {
      filename = path.replace('/@modules/', '')
      filename = nodePath.join(process.cwd(), '../node_modules', filename)
    } else {
      filename = path
    }
    code = callLoader(stylusToCssLoader, code, filename, { platform: 'web' })
    code = callLoader(cssToReactNativeLoader, code, filename)
    code = code.replace(/module\.exports\s*=\s*/, 'export default ')
    return code
  }
}

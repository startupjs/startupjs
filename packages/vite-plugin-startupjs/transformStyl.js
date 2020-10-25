const callLoader = require('@startupjs/bundler/lib/callLoader')
const stylusToCssLoader = require('@startupjs/bundler/lib/stylusToCssLoader')
const cssToReactNativeLoader = require('@startupjs/bundler/lib/cssToReactNativeLoader')
const nodePath = require('path')

module.exports = {
  test: (path) => /\.styl$/.test(path),
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

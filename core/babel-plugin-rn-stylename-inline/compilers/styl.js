// TODO: Move loaders into standalone libs
const stylLoader = require('@startupjs/bundler/lib/stylusToCssLoader')
const callLoader = require('@startupjs/bundler/lib/callLoader')
const compileCss = require('./css')

module.exports = function compileStyl (src, filename, options) {
  src = callLoader(
    stylLoader,
    src,
    filename,
    options
  )
  return compileCss(src)
}

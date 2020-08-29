// TODO: Move loaders into standalone libs
const cssLoader = require('@startupjs/bundler/lib/cssToReactNativeLoader')
const callLoader = require('@startupjs/bundler/lib/callLoader')
const { stripExport } = require('./helpers')

module.exports = function compileCss (src) {
  return stripExport(
    callLoader(
      cssLoader,
      src
    )
  )
}

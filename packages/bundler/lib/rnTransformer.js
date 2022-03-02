const upstreamTransformer = require('metro-react-native-babel-transformer')
const svgTransformer = require('react-native-svg-transformer')
const platformSingleton = require(
  '@startupjs/babel-plugin-rn-stylename-inline/platformSingleton'
)
const stylusToCssLoader = require('./stylusToCssLoader')
const cssToReactNativeLoader = require('./cssToReactNativeLoader')
const mdxExamplesLoader = require('./mdxExamplesLoader')
const mdxLoader = require('./mdxLoader')
const callLoader = require('./callLoader')

module.exports.transform = function ({ src, filename, options = {} }) {
  const { platform } = options
  platformSingleton.value = platform

  if (/\.styl$/.test(filename)) {
    src = callLoader(stylusToCssLoader, src, filename)
    src = callLoader(cssToReactNativeLoader, src, filename)
    return upstreamTransformer.transform({ src, filename, options })
  } else if (/\.css$/.test(filename)) {
    src = callLoader(cssToReactNativeLoader, src, filename)
    return upstreamTransformer.transform({ src, filename, options })
  } else if (/\.svg$/.test(filename)) {
    return svgTransformer.transform({ src, filename, options })
  } else if (/\.[cm]?jsx?$/.test(filename) && /['"]startupjs['"]/.test(src)) {
    return upstreamTransformer.transform({ src, filename, options })
  } else if (/\.mdx?$/.test(filename)) {
    src = callLoader(mdxExamplesLoader, src, filename)
    src = callLoader(mdxLoader, src, filename)
    return upstreamTransformer.transform({ src, filename, options })
  } else {
    return upstreamTransformer.transform({ src, filename, options })
  }
}

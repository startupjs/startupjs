const upstreamTransformer = require('metro-react-native-babel-transformer')
const svgTransformer = require('react-native-svg-transformer')
const platformSingleton = require(
  '@startupjs/babel-plugin-rn-stylename-inline/platformSingleton'
)
const stylusToCssLoader = require('./stylusToCssLoader')
const cssToReactNativeLoader = require('./cssToReactNativeLoader')
const mdxExamplesLoader = require('./mdxExamplesLoader')
const getMDXLoader = require('./getMDXLoader')
const eliminatorLoader = require('./eliminatorLoader')
const callLoader = require('./callLoader')

module.exports.transform = async function ({ src, filename, options = {} }) {
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
  } else if (/(?:[./]plugin\.[mc]?[jt]sx?|startupjs\.config\.js)$/.test(filename)) {
    src = callLoader(eliminatorLoader, src, filename, { envs: ['client', 'isomorphic'] })
    return upstreamTransformer.transform({ src, filename, options })
  } else if (/\.[cm]?jsx?$/.test(filename) && /['"]startupjs['"]/.test(src)) {
    // TODO: This particular check and transform is probably not needed anymore since default one
    //       will handle all .js files anyways no matter whether 'startupjs' library
    //       is used inside or not.
    return upstreamTransformer.transform({ src, filename, options })
  } else if (/\.mdx?$/.test(filename)) {
    const mdxLoader = await getMDXLoader()
    src = callLoader(mdxExamplesLoader, src, filename)
    src = callLoader(mdxLoader, src, filename)
    return upstreamTransformer.transform({ src, filename, options })
  } else {
    return upstreamTransformer.transform({ src, filename, options })
  }
}

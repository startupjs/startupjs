const platformSingleton = require('@startupjs/babel-plugin-rn-stylename-inline/platformSingleton')
const stylusToCssLoader = require('./lib/stylusToCssLoader')
const cssToReactNativeLoader = require('./lib/cssToReactNativeLoader')
const mdxExamplesLoader = require('./lib/mdxExamplesLoader')
const getMDXLoader = require('./lib/getMDXLoader')
const eliminatorLoader = require('./lib/eliminatorLoader')
const callLoader = require('./lib/callLoader')
const asyncSvgLoader = require('./lib/asyncSvgLoader')
const startupjsLoader = require('./lib/startupjsLoader')

module.exports.transform = async function startupjsMetroBabelTransform ({
  src, filename, options: { upstreamTransformer, ...options } = {}
}) {
  upstreamTransformer ??= getUpstreamTransformer()
  const { platform } = options
  platformSingleton.value = platform

  // from exotic extensions to js
  if (/\.styl$/.test(filename)) {
    // TODO: Refactor `platform` to be just passed externally as an option in metro and in webpack
    src = callLoader(stylusToCssLoader, src, filename)
    src = callLoader(cssToReactNativeLoader, src, filename)
  } else if (/\.css$/.test(filename)) {
    src = callLoader(cssToReactNativeLoader, src, filename)
  } else if (/\.svg$/.test(filename)) {
    src = await callLoader(asyncSvgLoader, src, filename)
  } else if (/\.mdx?$/.test(filename)) {
    const mdxLoader = await getMDXLoader()
    src = callLoader(mdxExamplesLoader, src, filename)
    src = callLoader(mdxLoader, src, filename)
  }

  // js transformations
  if (/\.[mc]?[jt]sx?$/.test(filename)) {
    src = callLoader(eliminatorLoader, src, filename, { envs: ['client', 'isomorphic'] })
  }
  if ((/\.mdx?$/.test(filename) || /\.[mc]?[jt]sx?$/.test(filename)) && /['"](?:startupjs|@env)['"]/.test(src)) {
    src = callLoader(startupjsLoader, src, filename, { platform })
  }

  return upstreamTransformer.transform({ src, filename, options })
}

function getUpstreamTransformer () {
  try {
    // Expo
    return require('@expo/metro-config/babel-transformer')
  } catch (err) {
    try {
      // React Native 0.73+
      return require('@react-native/metro-babel-transformer')
    } catch (err) {
      // React Native <0.73
      return require('metro-react-native-babel-transformer')
    }
  }
}

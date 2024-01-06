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
  if (/(?:[./]plugin\.[mc]?[jt]sx?|startupjs\.config\.[mc]?[jt]sx?)$/.test(filename)) {
    src = callLoader(eliminatorLoader, src, filename, { envs: ['client', 'isomorphic'] })
  }
  if ((/\.mdx?$/.test(filename) || /\.[mc]?[jt]sx?$/.test(filename)) && /['"]startupjs['"]/.test(src)) {
    src = callLoader(startupjsLoader, src, filename, { platform })
  }

  // NOTE: this is using:
  //   - @startupjs/bundler/full.js
  //   - @startupjs/bundler/skippablePreset.js
  //   - ./lib/startupjsFullLoader.js
  // Following is an experiment for combining all startupjs-related babel plugins into one preset
  // and running it all together in one babel transform.
  // The 'babel-preset-startupjs/full' preset also does check for the magic libraries within
  // babel itself through the skippablePreset.js hack.
  // Drawbacks of this approach:
  //   it still requires running transformation separately from the underlying expo/metro babel transform
  //   and just putting this preset into babel config doesn't work.
  //
  // if (/['"]@?startupjs(?:\/registry)?['"]/.test(src)) {
  //   if (/['"]@?startupjs\/registry['"]/.test(src)) {
  //     console.log('>>> with registry 88')
  //   }
  //   // src = callLoader(startupjsFullLoader, src, filename, { platform, envs: ['client', 'isomorphic'] })
  // }
  // src = callLoader(startupjsFullLoader, src, filename, { platform, envs: ['client', 'isomorphic'] })

  return upstreamTransformer.transform({ src, filename, options })
}

function getUpstreamTransformer () {
  try {
    return require('@expo/metro-config/babel-transformer')
  } catch (err) {
    try {
      return require('@react-native/metro-babel-transformer')
    } catch (err) {
      return require('metro-react-native-babel-transformer')
    }
  }
}

const stylusToCssLoader = require('cssxjs/loaders/stylusToCssLoader')
const cssToReactNativeLoader = require('cssxjs/loaders/cssToReactNativeLoader')
const mdxExamplesLoader = require('./lib/mdxExamplesLoader')
const mdxLoader = require('./lib/mdxLoader')
const callLoader = require('./lib/callLoader')
const asyncSvgLoader = require('./lib/asyncSvgLoader')

module.exports.transform = async function startupjsMetroBabelTransform ({
  src, filename, options: { upstreamTransformer, ...options } = {}
}) {
  upstreamTransformer ??= getUpstreamTransformer()
  const { platform } = options

  // from exotic extensions to js
  if (/\.styl$/.test(filename) && !/\.module\.styl/.test(filename)) {
    try {
      src = callLoader(stylusToCssLoader, src, filename, { platform })
      src = callLoader(cssToReactNativeLoader, src, filename)
    } catch (err) {
      console.error(`Error processing ${filename} with stylusToCssLoader:`, err)
      throw err
    }
  } else if (/\.css$/.test(filename) && !/\.module\.css$/.test(filename)) {
    try {
      src = callLoader(cssToReactNativeLoader, src, filename)
    } catch (err) {
      console.error(`Error processing ${filename} with cssToReactNativeLoader:`, err)
      throw err
    }
  } else if (/\.svg$/.test(filename)) {
    src = await callLoader(asyncSvgLoader, src, filename)
  } else if (/\.mdx?$/.test(filename)) {
    src = callLoader(mdxExamplesLoader, src, filename)
    src = callLoader(mdxLoader, src, filename)
  }

  return upstreamTransformer.transform({ src, filename, options })
}

function getUpstreamTransformer () {
  try {
    // Expo
    return require('@expo/metro-config/babel-transformer')
  } catch {
    try {
      // React Native 0.73+
      return require('@react-native/metro-babel-transformer')
    } catch {
      // React Native <0.73
      return require('metro-react-native-babel-transformer')
    }
  }
}

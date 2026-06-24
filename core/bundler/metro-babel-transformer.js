const stylusToCssLoader = require('cssxjs/loaders/stylusToCssLoader')
const cssToReactNativeLoader = require('cssxjs/loaders/cssToReactNativeLoader')
const mdxExamplesLoader = require('./lib/mdxExamplesLoader')
const mdxLoader = require('./lib/mdxLoader')
const callLoader = require('./lib/callLoader')
const asyncSvgLoader = require('./lib/asyncSvgLoader')

const DEFAULT_CSS_FILE_EXTENSIONS = ['cssx.css']
const DEFAULT_STYL_FILE_EXTENSIONS = ['styl']

module.exports.transform = async function startupjsMetroBabelTransform ({
  src, filename, options: { upstreamTransformer, ...options } = {}
}) {
  upstreamTransformer ??= getUpstreamTransformer()
  const { platform } = options
  let upstreamFilename = filename

  // from exotic extensions to js
  if (
    getBooleanEnv(process.env.STARTUPJS_METRO_TRANSFORM_STYL_FILES, true) &&
    shouldTransformStyleFile(filename, getExtensionsEnv(
      process.env.STARTUPJS_METRO_STYL_FILE_EXTENSIONS,
      DEFAULT_STYL_FILE_EXTENSIONS
    ))
  ) {
    try {
      src = callLoader(stylusToCssLoader, src, filename, { platform })
      src = callLoader(cssToReactNativeLoader, src, filename, { platform })
      upstreamFilename = filename + '.js'
    } catch (err) {
      console.error(`Error processing ${filename} with stylusToCssLoader:`, err)
      throw err
    }
  } else if (
    getBooleanEnv(process.env.STARTUPJS_METRO_TRANSFORM_CSS_FILES, false) &&
    shouldTransformStyleFile(filename, getExtensionsEnv(
      process.env.STARTUPJS_METRO_CSS_FILE_EXTENSIONS,
      DEFAULT_CSS_FILE_EXTENSIONS
    ))
  ) {
    try {
      src = callLoader(cssToReactNativeLoader, src, filename, { platform })
      upstreamFilename = filename + '.js'
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

  return upstreamTransformer.transform({ src, filename: upstreamFilename, options })
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

function shouldTransformStyleFile (filename, extensions) {
  if (isCssModule(filename)) return false
  return extensions.some(extension => filename.endsWith(`.${extension}`))
}

function isCssModule (filename) {
  return /\.module\.[^.]+$/.test(filename)
}

function getBooleanEnv (value, defaultValue) {
  if (value == null) return defaultValue
  return value === '1' || value === 'true'
}

function getExtensionsEnv (value, defaultValue) {
  try {
    const extensions = JSON.parse(value || 'null')
    return Array.isArray(extensions) ? extensions : defaultValue
  } catch {
    return defaultValue
  }
}

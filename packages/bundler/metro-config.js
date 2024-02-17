const { getFeatures } = require('@startupjs/babel-plugin-startupjs-plugins/loader')
const connect = require('connect')
const { readFileSync } = require('fs')
const { join, resolve } = require('path')

// To pass existing config for modification, pass it as 'upstreamConfig' in options:
//   config = getDefaultConfig(__dirname, { upstreamConfig })
exports.getDefaultConfig = function getDefaultConfig (projectRoot, { upstreamConfig } = {}) {
  let packageJson = {}
  try {
    packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'))
  } catch (err) {}
  const features = getFeatures(projectRoot)
  upstreamConfig ??= getUpstreamConfig(projectRoot)
  const isExpo = checkIfExpo(upstreamConfig)

  const config = {
    ...upstreamConfig,
    transformer: {
      ...upstreamConfig.transformer,
      babelTransformerPath: require.resolve('./metro-babel-transformer.js'),
      unstable_allowRequireContext: true
    },
    resolver: {
      ...upstreamConfig.resolver,
      assetExts: upstreamConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...new Set([
        ...(isExpo ? ['expo.ts', 'expo.tsx', 'expo.js', 'expo.jsx', 'expo.mjs', 'expo.cjs'] : []),
        ...(upstreamConfig.resolver.sourceExts || []),
        ...['mjs', 'cjs', 'md', 'mdx', 'css', 'styl', 'svg']
      ])],
      unstable_enablePackageExports: true
    }
  }

  // Add startupjs server middleware
  if (features.enableServer) addServer(config)

  // Support Yarn's `resolutions` field from doing `yarn link`
  if (packageJson.resolutions) addYarnLink(config, { packageJson, projectRoot })

  return config
}

function addServer (config) {
  config.server ??= {}
  config.server.enhanceMiddleware = metroMiddleware =>
    connect()
      .use(metroMiddleware)
      .use(getStartupjsMiddleware())
}

function addYarnLink (config, { packageJson, projectRoot }) {
  // `yarn link` adds paths with a prefix 'portal:' so we handle only those
  const linkPaths = Object.values(packageJson.resolutions)
    .filter(path => path.startsWith('portal:'))
    .map(path => path.replace(/^portal:/, ''))
    // paths might be relative to the project root
    .map(path => resolve(projectRoot, path))
  if (linkPaths.length === 0) return

  config.watchFolders = [...new Set([
    ...(config.watchFolders || []),
    projectRoot,
    ...linkPaths
  ])]
  config.resolver.nodeModulesPaths = [...new Set([
    ...(config.resolver.nodeModulesPaths || []),
    // this is supposed to be the default behavior of Metro, but after changing
    // the watchFolders it stops working for some reason
    resolve(projectRoot, 'node_modules')
  ])]
}

function getUpstreamConfig (projectRoot) {
  try {
    // Expo
    return require('expo/metro-config').getDefaultConfig(projectRoot, {
      // startupjs has a custom CSS implementation so we don't need to use Expo's
      isCSSEnabled: false
    })
  } catch (err) {
    try {
      // React Native 0.73+
      return require('@react-native/metro-config').getDefaultConfig(projectRoot)
    } catch (err) {
      // React Native <0.73
      return require('metro-config').getDefaultConfig()
    }
  }
}

function checkIfExpo (upstreamConfig) {
  if (/[\\/]@expo[\\/]metro-config[\\/]/.test(upstreamConfig?.transformer?.babelTransformerPath)) {
    return true
  }
  try {
    const path = require.resolve('expo/metro-config')
    return Boolean(path)
  } catch (err) {
    return false
  }
}

function getStartupjsMiddleware () {
  const middlewarePromise = (async () => {
    await import('./nodeRegister.mjs')
    const { createMiddleware } = await import('@startupjs/server')
    return (await createMiddleware()).middleware
  })()
  return function startupjsMiddleware (req, res, next) {
    (async () => {
      try {
        const middleware = await middlewarePromise
        return middleware ? middleware.apply(this, arguments) : next()
      } catch (err) {
        return next(err)
      }
    })()
  }
}

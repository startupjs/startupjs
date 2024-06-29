const { getFeatures } = require('@startupjs/babel-plugin-startupjs-plugins/loader')
const connect = require('connect')
const { readFileSync, existsSync } = require('fs')
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

  // Add startupjs server middleware.
  // Unless we're building (yarn build), in which case we don't need it.
  if (!process.env.IS_BUILD && features.enableServer) addServer(config)

  // Support Yarn's `resolutions` field from doing `yarn link`
  handleYarnLink(config, { packageJson, projectRoot })

  return config
}

function addServer (config) {
  config.server ??= {}
  config.server.enhanceMiddleware = metroMiddleware =>
    connect()
      .use(getStartupjsMiddleware())
      .use(metroMiddleware)
}

function handleYarnLink (config, { packageJson, projectRoot }) {
  const { packageJson: monorepoPackageJson, folderPath: monorepoRoot } = getMonorepoRootPackageJson(projectRoot) || {}
  const isMonorepo = monorepoPackageJson && monorepoRoot
  const resolutions = isMonorepo ? monorepoPackageJson.resolutions : packageJson.resolutions
  if (!resolutions) return

  const resolutionsRoot = isMonorepo ? monorepoRoot : projectRoot

  // `yarn link` adds paths with a prefix 'portal:' so we handle only those
  const linkPaths = Object.values(resolutions)
    .filter(path => path.startsWith('portal:'))
    .map(path => path.replace(/^portal:/, ''))
    // paths might be specified as relative so we need to resolve them to absolute
    .map(path => resolve(resolutionsRoot, path))

  config.watchFolders = [...new Set([
    ...(config.watchFolders || []),
    ...linkPaths
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

function getMonorepoRootPackageJson (projectRoot) {
  // Find and return the monorepo root package.json:
  // - go up the directory tree
  // - look for the first package.json which has a `workspaces` field
  let parent = projectRoot
  let count = 0
  while (true) {
    if (++count > 100) throw Error('Infinite loop while looking for monorepo root package.json')
    const newParent = resolve(parent, '..')
    if (newParent === parent) return
    parent = newParent
    try {
      const packageJsonPath = join(parent, 'package.json')
      if (!existsSync(packageJsonPath)) continue
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      if (packageJson.workspaces) return { packageJson, folderPath: parent }
    } catch (err) {}
  }
}

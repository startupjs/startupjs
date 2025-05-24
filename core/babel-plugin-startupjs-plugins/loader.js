// Plugins Manager API
// used by the framework to find all plugins and import them

/**
 * Algorithm (recursive):
 * 1. if package.json has 'startupjs' dependency (in regular/dev/peer) then it's a framework package
 * 2. parse its "exports" field
 * 3. find exports which are called "plugin" or end with ".plugin"
 *    IMPORTANT: There should be NO '.js' extension in the export name itself!
 *               Glob exports won't work either, make sure you specify the exact export for the plugin.
 *               Example:
 *                   "exports": {
 *                     ".": "./index.js",
 *                     "./*": "./*.js",
 *                     "./plugin": "./plugin.js",
 *                     "./advanced/plugin": "./advanced/plugin/index.js",
 *                     "./lib/emojis.plugin": "./lib/emojis.plugin.js"
 *                   }
 * 4. scan all dependencies and repeat for each of them
 *
 * The plugins found in "exports" are going to be automatically imported in
 * @startupjs/registry/loadStartupjsConfig.js file
 */
const { existsSync, readFileSync, readdirSync } = require('fs')
const { join, dirname, relative, resolve: pathResolve } = require('path')
const resolve = require('resolve')

const ROOT = process.cwd()
const CONFIG_FILENAMES = ['.js', '.mjs', '.jsx', '.ts', '.tsx'].map(ext => `startupjs.config${ext}`)

// all packages having this dependency will be considered part of the framework.
const MAGIC_DEPENDENCY = 'startupjs'

exports.getConfigFilePaths = (root = ROOT) => {
  return CONFIG_FILENAMES.map(filename => join(root, filename))
}

exports.getRelativeConfigImport = (sourceFilename, root = ROOT) => {
  // find startupjs.config.js
  const configFileName = CONFIG_FILENAMES.find(filename => existsSync(join(root, filename)))
  if (!configFileName) return
  const configFilePath = join(root, configFileName)
  const relativePath = relative(dirname(pathResolve(root, sourceFilename)), configFilePath)
  if (!relativePath.startsWith('.')) return './' + relativePath
  return relativePath
}

exports.getRelativeModelRequireContextPath = (sourceFilename, root = ROOT) => {
  const modelFolder = join(root, 'model')
  return relative(dirname(pathResolve(root, sourceFilename)), modelFolder)
}

exports.getRelativeModelImports = (sourceFilename, root = ROOT) => {
  // find model folder
  const modelFolder = join(root, 'model')
  if (!existsSync(modelFolder)) return {}
  // find all files in the model folder
  const modelImports = {}
  for (const filename of readdirSync(modelFolder)) {
    if (!/\.[mc]?[jt]sx?$/.test(filename)) continue
    modelImports[filename] = relative(dirname(pathResolve(root, sourceFilename)), join(modelFolder, filename))
  }
  return modelImports
}

exports.getFeatures = (root = ROOT) => {
  const features = {}
  const serverFolder = join(root, 'server')
  if (existsSync(serverFolder)) {
    for (const filename of readdirSync(serverFolder)) {
      // enable server if there is at least one JS file in the 'server' folder
      if (/\.[mc]?[jt]sx?$/.test(filename)) {
        features.enableServer = true
        break
      }
    }
  }
  // after that do a naive check for enableServer in startupjs.config.js
  const configFilePaths = exports.getConfigFilePaths(root)
  for (const configFilePath of configFilePaths) {
    if (existsSync(configFilePath)) {
      // just do a simple static scan with regex to find enableServer: true | false
      const configContent = readFileSync(configFilePath, 'utf8')
      if (/enableServer:\s*true/.test(configContent)) {
        features.enableServer = true
      } else if (/enableServer:\s*false/.test(configContent)) {
        features.enableServer = false
      }
      break
    }
  }
  return features
}

exports.getRelativePluginImports = (sourceFilename, root = ROOT) => {
  if (!existsSync(join(root, 'package.json'))) {
    throw Error('Can\'t find package.json in the root of the project. ' +
      'Make sure you start the app from the root of the project.')
  }
  const pluginImports = parsePackage(root, root)
  return Array.from(pluginImports).map(pluginImport => {
    if (!pluginImport.startsWith('.')) return pluginImport
    return relative(dirname(pathResolve(root, sourceFilename)), pathResolve(root, pluginImport))
  })
}

function parsePackage (root, packagePath, _pluginImports = new Set(), _handledPackages = new Set()) {
  if (_handledPackages.has(packagePath)) return
  _handledPackages.add(packagePath)

  const packageJsonPath = join(packagePath, 'package.json')
  if (!existsSync(packageJsonPath)) return

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  if (!isPartOfFramework(packageJson)) return

  // find all dependant framework packages and load their plugins first
  const packagePaths = getPackagePathsFromPackageJson(root, packageJson)
  for (const packagePath of packagePaths) {
    parsePackage(root, packagePath, _pluginImports, _handledPackages)
  }

  const packageName = packageJson.name

  // Find all plugins in "exports" field
  // TODO: duplicate plugins are just ignored atm.
  //       We should deal with them somehow if their versions are different
  for (const exportPath in (packageJson.exports || {})) {
    if (!/[./]plugin$/.test(exportPath)) continue
    if (packagePath === root) {
      // if we are on the project level itself, then we just import the file itself
      _pluginImports.add(packageJson.exports[exportPath])
    } else {
      _pluginImports.add(join(packageName, exportPath))
    }
  }

  return _pluginImports
}

function isPartOfFramework (packageJson) {
  if (/^(?:startupjs|@startupjs\/)/.test(packageJson.name)) return true
  for (const deps of ['peerDependencies', 'dependencies', 'devDependencies']) {
    if (packageJson[deps]?.[MAGIC_DEPENDENCY]) return true
  }
  return false
}

// ref: react-native-community/cli
// IMPORTANT:
//   This uses old algorithm of require() which doesn't take into account "exports" field
//   which is exactly what we need here since we are searching for the package folder.
//   And the way to find it universally is to resolve the location of its package.json.
//   In ESM though the "exports" field might not have package.json in it, so a modern
//   node resolution algorithm won't find it.
//   That's why it's crucial to use the old resolution algorithm which ignores "exports" completely,
//   which is exactly how it works in the older version of 'resolve' package (^1.20.0)
function resolveNodeModuleDir (root, packageName) {
  try {
    return dirname(
      resolve.sync(join(packageName, 'package.json'), {
        basedir: root
      })
    )
  } catch (err) {
  }
}

function getPackagePathsFromPackageJson (root, packageJson) {
  return Object.keys({
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  })
    .map(packageName => resolveNodeModuleDir(root, packageName))
    .filter(Boolean)
}

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
 * The plugins found in "exports" are going to be automatically imported in the main startupjs.config.js file
 * where createProject() is called
 */
const fs = require('fs')
const fsPath = require('path')
const resolve = require('resolve')

const ROOT = process.cwd()

// all packages having this dependency will be considered part of the framework.
const MAGIC_DEPENDENCY = 'startupjs'

exports.getPluginImports = (root = ROOT) => {
  if (!fs.existsSync(fsPath.join(root, 'package.json'))) {
    throw Error('Can\'t find package.json in the root of the project. ' +
      'Make sure you start the app from the root of the project.')
  }
  const pluginImports = parsePackage(root, root)
  return Array.from(pluginImports)
}

function parsePackage (root, packagePath, _pluginImports = new Set(), _handledPackages = new Set()) {
  if (_handledPackages.has(packagePath)) return
  _handledPackages.add(packagePath)

  const packageJsonPath = fsPath.join(packagePath, 'package.json')
  if (!fs.existsSync(packageJsonPath)) return

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
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
      // if we are on the project level itself, then we don't need to add the package name
      _pluginImports.add(exportPath)
    } else {
      _pluginImports.add(fsPath.join(packageName, exportPath))
    }
  }

  return _pluginImports
}

function isPartOfFramework (packageJson) {
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
    return fsPath.dirname(
      resolve.sync(fsPath.join(packageName, 'package.json'), {
        basedir: root
      })
    )
  } catch (err) {
  }
}

function getPackagePathsFromPackageJson (root, packageJson) {
  return Object.keys({
    ...packageJson.peerDependencies,
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  })
    .map(packageName => resolveNodeModuleDir(root, packageName))
    .filter(Boolean)
}

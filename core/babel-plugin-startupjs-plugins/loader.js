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
const { existsSync, readFileSync, readdirSync, lstatSync } = require('fs')
const { join, dirname, relative, resolve: pathResolve } = require('path')
const parser = require('@babel/parser')
const resolve = require('resolve')

const ROOT = process.cwd()
const CONFIG_FILENAMES = ['.js', '.mjs', '.jsx', '.ts', '.tsx'].map(ext => `startupjs.config${ext}`)

function toImportPath (filePath) {
  // These values are used as JS import specifiers, which must use forward
  // slashes even when path.relative() returns Windows separators.
  return filePath.replace(/\\/g, '/')
}

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
  const relativePath = toImportPath(relative(dirname(pathResolve(root, sourceFilename)), configFilePath))
  if (!relativePath.startsWith('.')) return './' + relativePath
  return relativePath
}

exports.getRelativeModelPath = (sourceFilePath, root = ROOT) => {
  const modelFolder = join(root, 'model')
  return toImportPath(relative(dirname(pathResolve(root, sourceFilePath)), modelFolder))
}

exports.getRelativeModelImports = (sourceFilePath, root = ROOT) => {
  // find model folder
  const modelFolder = join(root, 'model')
  return getRelativeImports(modelFolder, sourceFilePath, root)
}

function getRelativeImports (folder, sourceFilePath, root) {
  if (!existsSync(folder)) return []
  // recursively find all files in folder
  const modelImports = []
  for (const filename of readdirSync(folder)) {
    const filePath = join(folder, filename)
    if (lstatSync(filePath).isDirectory()) {
      const subImports = getRelativeImports(filePath, sourceFilePath, root)
      modelImports.push(...subImports)
      continue
    }
    if (!/\.[mc]?[jt]sx?$/.test(filename)) continue
    const relativePath = toImportPath(relative(dirname(pathResolve(root, sourceFilePath)), filePath))
    modelImports.push(relativePath)
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
    return toImportPath(relative(dirname(pathResolve(root, sourceFilename)), pathResolve(root, pluginImport)))
  })
}

exports.getPluginTypeEntries = (root = ROOT) => {
  if (!existsSync(join(root, 'package.json'))) return []
  const pluginOptions = getStaticPluginOptions(root)
  const pluginTypes = parsePackageTypes(root, root)
  return Array.from(pluginTypes.values()).map(pluginType => ({
    ...pluginType,
    optionsType: pluginOptions.get(pluginType.name)
  }))
}

exports.getStaticFeaturesType = (root = ROOT) => {
  const featuresType = getStaticFeatures(root)
  return featuresType || '{}'
}

function parsePackage (root, packagePath, _pluginImports = new Set(), _handledPackages = new Set()) {
  if (_handledPackages.has(packagePath)) return
  _handledPackages.add(packagePath)

  const packageJsonPath = join(packagePath, 'package.json')
  if (!existsSync(packageJsonPath)) return

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  if (!isPartOfFramework(packageJson)) return

  // find all dependant framework packages and load their plugins first.
  // Resolve each dependency from the CURRENT package's location (packagePath),
  // not the app root — otherwise a transitive framework dep that isn't hoisted to
  // the app's node_modules (e.g. @startupjs/auth nested under startupjs's own
  // node_modules, which happens with portal:/file: links or a strict pnpm-style
  // layout) is never found, and its plugins silently go undiscovered. Node's
  // resolution walks UP from the basedir, so resolving from packagePath still
  // finds hoisted deps too.
  const packagePaths = getPackagePathsFromPackageJson(packagePath, packageJson)
  for (const packagePath of packagePaths) {
    parsePackage(root, packagePath, _pluginImports, _handledPackages)
  }

  const packageName = packageJson.name

  // Find all plugins in "exports" field
  // TODO: duplicate plugins are just ignored atm.
  //       We should deal with them somehow if their versions are different
  for (const exportPath in (packageJson.exports || {})) {
    if (!/[./]plugin$/.test(exportPath)) continue
    const pluginImport = getDefaultExportTarget(packageJson.exports[exportPath])
    if (typeof pluginImport !== 'string') continue
    if (packagePath === root) {
      // if we are on the project level itself, then we just import the file itself
      _pluginImports.add(pluginImport)
    } else {
      _pluginImports.add(join(packageName, exportPath))
    }
  }

  return _pluginImports
}

function parsePackageTypes (root, packagePath, _pluginTypes = new Map(), _handledPackages = new Set()) {
  if (_handledPackages.has(packagePath)) return _pluginTypes
  _handledPackages.add(packagePath)

  const packageJsonPath = join(packagePath, 'package.json')
  if (!existsSync(packageJsonPath)) return _pluginTypes

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  if (!isPartOfFramework(packageJson)) return _pluginTypes

  const packagePaths = getPackagePathsFromPackageJson(root, packageJson)
  for (const packagePath of packagePaths) {
    parsePackageTypes(root, packagePath, _pluginTypes, _handledPackages)
  }

  const packageName = packageJson.name
  const exports = packageJson.exports || {}

  for (const exportPath in exports) {
    if (!/[./]plugin$/.test(exportPath)) continue
    if (!hasTypesExport(exports[exportPath])) continue

    const importPath = packagePath === root
      ? getDefaultExportTarget(exports[exportPath])
      : join(packageName, exportPath)

    if (typeof importPath !== 'string') continue

    const normalizedImportPath = toImportPath(importPath)
    if (_pluginTypes.has(normalizedImportPath)) continue

    _pluginTypes.set(normalizedImportPath, {
      name: getPluginName(packageName, exportPath),
      importPath: normalizedImportPath
    })
  }

  return _pluginTypes
}

function getDefaultExportTarget (exportValue) {
  if (typeof exportValue === 'string') return exportValue
  if (exportValue && typeof exportValue === 'object') {
    return exportValue.default || exportValue.import || exportValue.require
  }
}

function hasTypesExport (exportValue) {
  return exportValue && typeof exportValue === 'object' && typeof exportValue.types === 'string'
}

function getPluginName (packageName, exportPath) {
  const normalizedExportPath = exportPath.replace(/^\.\//, '')
  if (normalizedExportPath === 'plugin') {
    const parts = packageName.split('/')
    return parts[parts.length - 1]
  }
  return normalizedExportPath.split('/').pop().replace(/\.plugin$/, '')
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
  } catch { /* suppress */ }
}

function getPackagePathsFromPackageJson (root, packageJson) {
  return Object.keys({
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  })
    .map(packageName => resolveNodeModuleDir(root, packageName))
    .filter(Boolean)
}

function getStaticPluginOptions (root) {
  const configObject = getStaticConfigObject(root)
  const pluginsObject = getObjectProperty(configObject, 'plugins')
  if (!pluginsObject) return new Map()

  const res = new Map()
  for (const property of pluginsObject.properties || []) {
    if (!isObjectProperty(property) || property.computed) continue
    const name = getPropertyName(property.key)
    if (!name) continue
    res.set(name, astToType(property.value))
  }
  return res
}

function getStaticFeatures (root) {
  const configObject = getStaticConfigObject(root)
  const featuresObject = getObjectProperty(configObject, 'features')
  if (!featuresObject) return
  return astToType(featuresObject)
}

function getStaticConfigObject (root) {
  const configFilePath = exports.getConfigFilePaths(root).find(existsSync)
  if (!configFilePath) return

  try {
    const ast = parser.parse(readFileSync(configFilePath, 'utf8'), {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    })
    return findConfigObject(ast)
  } catch {

  }
}

function findConfigObject (ast) {
  const variables = new Map()
  for (const node of ast.program.body) {
    if (node.type === 'VariableDeclaration') {
      for (const declaration of node.declarations) {
        if (declaration.id.type === 'Identifier') {
          const value = unwrapExpression(declaration.init)
          if (value?.type === 'ObjectExpression') variables.set(declaration.id.name, value)
        }
      }
      continue
    }
    if (node.type !== 'ExportDefaultDeclaration') continue
    const declaration = unwrapExpression(node.declaration)
    if (declaration?.type === 'ObjectExpression') return declaration
    if (declaration?.type === 'Identifier') return variables.get(declaration.name)
    if (declaration?.type === 'CallExpression') {
      const firstArg = unwrapExpression(declaration.arguments?.[0])
      if (firstArg?.type === 'ObjectExpression') return firstArg
    }
  }
}

function getObjectProperty (objectExpression, name) {
  if (objectExpression?.type !== 'ObjectExpression') return
  const property = (objectExpression.properties || []).find(property => {
    return isObjectProperty(property) && !property.computed && getPropertyName(property.key) === name
  })
  const value = unwrapExpression(property?.value)
  return value?.type === 'ObjectExpression' ? value : undefined
}

function astToType (node) {
  node = unwrapExpression(node)
  if (!node) return 'unknown'

  switch (node.type) {
    case 'ObjectExpression':
      return objectExpressionToType(node)
    case 'ArrayExpression':
      return arrayExpressionToType(node)
    case 'StringLiteral':
      return JSON.stringify(node.value)
    case 'NumericLiteral':
      return Number.isFinite(node.value) ? String(node.value) : 'number'
    case 'BooleanLiteral':
      return String(node.value)
    case 'NullLiteral':
      return 'null'
    case 'Identifier':
      return node.name === 'undefined' ? 'undefined' : 'unknown'
    case 'UnaryExpression':
      if (node.operator === '-' && node.argument.type === 'NumericLiteral') return String(-node.argument.value)
      return 'unknown'
    default:
      return 'unknown'
  }
}

function objectExpressionToType (node) {
  const lines = []
  for (const property of node.properties || []) {
    if (!isObjectProperty(property) || property.computed) continue
    const key = getPropertyName(property.key)
    if (!key) continue
    lines.push(`${formatTypePropertyKey(key)}: ${astToType(property.value)}`)
  }
  return lines.length ? `{ ${lines.join('; ')} }` : '{}'
}

function arrayExpressionToType (node) {
  const elements = (node.elements || []).map(element => astToType(element))
  return `readonly [${elements.join(', ')}]`
}

function isObjectProperty (node) {
  return node?.type === 'ObjectProperty' || node?.type === 'Property'
}

function getPropertyName (key) {
  if (key.type === 'Identifier') return key.name
  if (key.type === 'StringLiteral') return key.value
  if (key.type === 'NumericLiteral') return String(key.value)
}

function formatTypePropertyKey (name) {
  return /^[$A-Z_a-z][$\w]*$/.test(name) ? name : JSON.stringify(name)
}

function unwrapExpression (node) {
  while (
    node?.type === 'TSAsExpression' ||
    node?.type === 'TSSatisfiesExpression' ||
    node?.type === 'TSNonNullExpression' ||
    node?.type === 'ParenthesizedExpression'
  ) {
    node = node.expression
  }
  return node
}

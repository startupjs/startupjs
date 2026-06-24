const { statSync } = require('fs')
const { join } = require('path')
const { addDefault } = require('@babel/helper-module-imports')
const {
  getRelativePluginImports, getRelativeConfigImport, getConfigFilePaths,
  getFeatures
} = require('./loader')

const VIRTUAL_CONFIG_IMPORT_REGEX = /(?:^|\/)startupjs\.config\.virtual\.js$/
const VIRTUAL_PLUGINS_IMPORT_REGEX = /(?:^|\/)startupjs\.plugins\.virtual\.js$/
const VIRTUAL_FEATURES_IMPORT_REGEX = /(?:^|\/)startupjs\.features\.virtual\.js$/
const PACKAGE_DEPENDENCY_FILENAMES = [
  'package.json',
  'yarn.lock',
  'package-lock.json',
  'pnpm-lock.yaml',
  'bun.lockb'
]

module.exports = function (api, options) {
  const { types: t, template } = api
  const root = options.root || process.cwd()

  // watch startupjs.config.js files for changes
  for (const configFilePath of getConfigFilePaths(root)) {
    api.cache.using(() => mtime(configFilePath))
    api.addExternalDependency(configFilePath)
  }

  for (const filename of PACKAGE_DEPENDENCY_FILENAMES) {
    const filePath = join(root, filename)
    api.cache.using(() => mtime(filePath))
    api.addExternalDependency(filePath)
  }

  return {
    visitor: {
      Program: ($program, { file }) => {
        const filename = file.opts.filename
        let triggered
        for (const $import of $program.get('body')) {
          if (!$import.isImportDeclaration()) continue
          if (isVirtualImport($import, VIRTUAL_CONFIG_IMPORT_REGEX)) {
            loadVirtualConfig($import, { $program, filename, t, root })
            triggered = true
            continue
          } else if (isVirtualImport($import, VIRTUAL_PLUGINS_IMPORT_REGEX)) {
            loadVirtualPlugins($import, { $program, filename, t, template, root })
            triggered = true
            continue
          } else if (isVirtualImport($import, VIRTUAL_FEATURES_IMPORT_REGEX)) {
            loadVirtualFeatures($import, { $program, t, template, root })
            triggered = true
            continue
          }
        }
        if (triggered) $program.scope.crawl()
      }
    }
  }
}

// if startupjs.config.js exists in the project, replace the magic import with it
function loadVirtualConfig ($import, { $program, filename, t, root }) {
  validateConfigImport($import)
  const configFileImport = getRelativeConfigImport(filename, root)

  if (configFileImport) {
    $import.get('source').replaceWith(t.stringLiteral(configFileImport))
  }
}

function loadVirtualPlugins ($import, { $program, filename, t, template, root }) {
  const buildPluginsConst = template('const %%name%% = %%plugins%%')
  validatePluginsImport($import)

  // remove the original magic import
  const name = $import.get('specifiers.0.local').node.name
  $import.remove()

  // traverse though the packages tree and find all module, plugins and configs for them
  const pluginImports = getRelativePluginImports(filename, root)

  const plugins = []
  for (const pluginImport of pluginImports) {
    plugins.push(addDefaultImport($program, pluginImport))
  }

  const pluginsConst = buildPluginsConst({ name, plugins: t.arrayExpression(plugins) })
  const $lastImport = $program.get('body').filter($i => $i.isImportDeclaration()).pop()
  $lastImport.insertAfter(pluginsConst)
}

function loadVirtualFeatures ($import, { $program, t, template, root }) {
  const buildFeaturesConst = template('const %%name%% = %%features%%')
  validateFeaturesImport($import)

  const featuresData = getFeatures(root)
  const features = t.objectExpression([])
  for (const key in featuresData) {
    features.properties.push(t.objectProperty(t.stringLiteral(key), t.valueToNode(featuresData[key])))
  }

  // remove the original magic import
  const name = $import.get('specifiers.0.local').node.name
  $import.remove()

  // dummy usage of plugins to make sure they are not removed by dead code elimination
  const modelsConst = buildFeaturesConst({ name, features })
  const $lastImport = $program.get('body').filter($i => $i.isImportDeclaration()).pop()
  $lastImport.insertAfter(modelsConst)
}

// Handle only magic import which imports a magic function
function isVirtualImport ($import, regex) {
  return regex.test($import.get('source').node.value)
}

function mtime (filePath) {
  try {
    return statSync(filePath).mtimeMs
  } catch {
    return null
  }
}

function addDefaultImport ($program, sourceName) {
  return addDefault($program, sourceName, {
    importedType: 'es6',
    importPosition: 'after'
  })
}

function validateConfigImport ($import) {
  const $specifiers = $import.get('specifiers')
  if ($specifiers.length === 0 || $specifiers.length > 1 || !$specifiers[0].isImportDefaultSpecifier()) {
    throw $import.buildCodeFrameError('Virtual config import must have a single default import')
  }
}

function validatePluginsImport ($import) {
  const $specifiers = $import.get('specifiers')
  if ($specifiers.length === 0 || $specifiers.length > 1 || !$specifiers[0].isImportDefaultSpecifier()) {
    throw $import.buildCodeFrameError('Virtual plugins import must have a single default import')
  }
}

function validateFeaturesImport ($import) {
  const $specifiers = $import.get('specifiers')
  if ($specifiers.length === 0 || $specifiers.length > 1 || !$specifiers[0].isImportDefaultSpecifier()) {
    throw $import.buildCodeFrameError('Virtual features import must have a single default import')
  }
}

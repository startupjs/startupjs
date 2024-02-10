const { statSync } = require('fs')
const { addDefault } = require('@babel/helper-module-imports')
const {
  getRelativePluginImports, getRelativeConfigImport, getConfigFilePaths, getRelativeModelImports
} = require('./loader')

const VIRTUAL_CONFIG_IMPORT_REGEX = /(?:^|\/)startupjs\.config\.virtual\.js$/
const VIRTUAL_MODELS_IMPORT_REGEX = /(?:^|\/)startupjs\.models\.virtual\.js$/
const VIRTUAL_PLUGINS_IMPORT_REGEX = /(?:^|\/)startupjs\.plugins\.virtual\.js$/
const MODEL_PATTERN_REGEX = /^[a-zA-Z0-9$_*.]+$/

module.exports = function (api, options) {
  const { types: t, template } = api

  // watch startupjs.config.js files for changes
  for (const configFilePath of getConfigFilePaths(options.root)) {
    api.cache.using(() => mtime(configFilePath))
    api.addExternalDependency(configFilePath)
  }

  // private vars to share state inside visitor. You must reset them in pre()
  let $program, filename

  return {
    pre () {
      // reset all private vars
      ;[$program, filename] = []
    },
    visitor: {
      Program: ($this, { file }) => {
        $program = $this
        filename = file.opts.filename
      },
      ImportDeclaration: ($this) => {
        if (isVirtualImport($this, VIRTUAL_CONFIG_IMPORT_REGEX)) {
          return loadVirtualConfig($this, { $program, filename, t, root: options.root })
        } else if (isVirtualImport($this, VIRTUAL_PLUGINS_IMPORT_REGEX)) {
          return loadVirtualPlugins($this, { $program, filename, t, template, root: options.root })
        } else if (isVirtualImport($this, VIRTUAL_MODELS_IMPORT_REGEX)) {
          return loadVirtualModels($this, { $program, filename, t, template, root: options.root })
        }
      }
    }
  }
}

// if startupjs.config.js exists in the project, replace the magic import with it
function loadVirtualConfig ($import, { $program, filename, t, root }) {
  const configFileImport = getRelativeConfigImport(filename, root)

  if (configFileImport) {
    $import.get('source').replaceWith(t.stringLiteral(configFileImport))
  }
}

function loadVirtualPlugins ($import, { $program, filename, t, template, root }) {
  const buildPluginsConst = template('const %%name%% = %%plugins%%')

  // remove the original magic import
  validatePluginsImport($import)
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

function loadVirtualModels ($import, { $program, filename, t, template, root }) {
  const buildModelsConst = template('const %%name%% = %%models%%')

  // find all models in the project's `models` directory
  const modelImports = getRelativeModelImports(filename, root)

  const models = t.objectExpression([])
  for (const modelFilename in modelImports) {
    const modelPattern = getModelPattern(modelFilename, $import)
    models.properties.push(t.objectProperty(
      t.stringLiteral(modelPattern),
      addDefaultImport($program, modelImports[modelFilename])
    ))
  }

  // remove the original magic import
  validateModelsImport($import)
  const name = $import.get('specifiers.0.local').node.name
  $import.remove()

  // dummy usage of plugins to make sure they are not removed by dead code elimination
  const modelsConst = buildModelsConst({ name, models })
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
    importedInterop: 'uncompiled',
    importPosition: 'after'
  })
}

function validatePluginsImport ($import) {
  const $specifiers = $import.get('specifiers')
  if ($specifiers.length === 0 || $specifiers.length > 1 || !$specifiers[0].isImportDefaultSpecifier()) {
    throw $import.buildCodeFrameError('Virtual plugins import must have a single default import')
  }
}

function validateModelsImport ($import) {
  const $specifiers = $import.get('specifiers')
  if ($specifiers.length === 0 || $specifiers.length > 1 || !$specifiers[0].isImportDefaultSpecifier()) {
    throw $import.buildCodeFrameError('Virtual models import must have a single default import')
  }
}

function getModelPattern (modelFilename, $import) {
  let pattern = modelFilename
  if (/\*/.test(pattern)) {
    throw $import.buildCodeFrameError('Instead of `*` in model filename use `[id]`. Got: ' + modelFilename)
  }
  // replace [id] with *
  pattern = pattern.replace(/\[[^\]]*\]/g, '*')
  // remove extension
  pattern = pattern.replace(/\.[^.]+$/, '')
  // validate pattern
  if (!MODEL_PATTERN_REGEX.test(pattern)) {
    throw $import.buildCodeFrameError(
      'Invalid model filename pattern: ' + modelFilename + '\n' +
      'It has to comply with the following regex: ' + MODEL_PATTERN_REGEX.toString() +
      ' with `[id]` instead of `*`')
  }
  return pattern
}

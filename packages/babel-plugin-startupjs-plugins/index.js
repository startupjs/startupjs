const { statSync } = require('fs')
const { addDefault } = require('@babel/helper-module-imports')
const {
  getRelativePluginImports, getRelativeConfigImport, getConfigFilePaths,
  getRelativeModelImports, getFeatures, getRelativeModelRequireContextPath
} = require('./loader')

const VIRTUAL_CONFIG_IMPORT_REGEX = /(?:^|\/)startupjs\.config\.virtual\.js$/
const VIRTUAL_MODELS_IMPORT_REGEX = /(?:^|\/)startupjs\.models\.virtual\.js$/
const VIRTUAL_PLUGINS_IMPORT_REGEX = /(?:^|\/)startupjs\.plugins\.virtual\.js$/
const VIRTUAL_FEATURES_IMPORT_REGEX = /(?:^|\/)startupjs\.features\.virtual\.js$/

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
          if (options.useRequireContext) {
            return loadVirtualModelsRequireContext($this, { $program, filename, t, template, root: options.root })
          } else {
            return loadVirtualModels($this, { $program, filename, t, template, root: options.root })
          }
        } else if (isVirtualImport($this, VIRTUAL_FEATURES_IMPORT_REGEX)) {
          return loadVirtualFeatures($this, { $program, t, template, root: options.root })
        }
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

function loadVirtualModels ($import, { $program, filename, t, template, root }) {
  const buildModelsConst = template('const %%name%% = %%models%%')
  validateModelsImport($import)

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
  const name = $import.get('specifiers.0.local').node.name
  $import.remove()

  // dummy usage of plugins to make sure they are not removed by dead code elimination
  const modelsConst = buildModelsConst({ name, models })
  const $lastImport = $program.get('body').filter($i => $i.isImportDeclaration()).pop()
  $lastImport.insertAfter(modelsConst)
}

function loadVirtualModelsRequireContext ($import, { $program, filename, t, template, root }) {
  // model/index.js file is ignored
  const buildModelsConst = template(/* js */`
    const __modelsContext = require.context(
      %%folder%%,
      false,
      /^(?!.*(?:\\/|^)index\\.[mc]?[jt]sx?$).*\\.[mc]?[jt]sx?$/
    )
    const %%name%% = __modelsContext.keys().reduce(
      (res, filename) => {
        const pattern = __getModelPattern(filename)
        return { ...res, [pattern]: __modelsContext(filename).default }
      },
      {}
    )
    ${getModelPatternFunction({ precompiled: true, functionName: '__getModelPattern' })}
  `)
  validateModelsImport($import)

  const requireContextFolder = getRelativeModelRequireContextPath(filename, root)

  // remove the original magic import
  const name = $import.get('specifiers.0.local').node.name
  $import.remove()

  const modelsConst = buildModelsConst({
    name,
    folder: t.stringLiteral(requireContextFolder)
  })
  const $lastImport = $program.get('body').filter($i => $i.isImportDeclaration()).pop()
  $lastImport.insertAfter(modelsConst)
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
    importedInterop: 'uncompiled',
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

function validateModelsImport ($import) {
  const $specifiers = $import.get('specifiers')
  if ($specifiers.length === 0 || $specifiers.length > 1 || !$specifiers[0].isImportDefaultSpecifier()) {
    throw $import.buildCodeFrameError('Virtual models import must have a single default import')
  }
}

function validateFeaturesImport ($import) {
  const $specifiers = $import.get('specifiers')
  if ($specifiers.length === 0 || $specifiers.length > 1 || !$specifiers[0].isImportDefaultSpecifier()) {
    throw $import.buildCodeFrameError('Virtual features import must have a single default import')
  }
}

const getModelPattern = getModelPatternFunction()

// IMPORTANT: this function is used in both in the babel plugin itself and
//            can be output to the generated code when using require.context for models.
//            - default implementation is for usage in the generated code and throws runtime errors.
//            - when using in babel instead of `throw Error` we do `throw $import.buildCodeFrameError`
function getModelPatternFunction ({ precompiled = false, functionName = '__getModelPattern' } = {}) {
  let functionBody = /* js */`
    const modelFilename = arguments[0]
    /* $1 */
    const MODEL_PATTERN_REGEX = /^[a-zA-Z0-9$_*.]+$/
    let pattern = modelFilename
    if (/\\*/.test(pattern)) {
      throw Error("[models] Instead of '*' in model filename use '[id]'. Got: " + modelFilename)
    }
    // replace [id] with *
    pattern = pattern.replace(/\\[[^\\]]*\\]/g, '*')
    // remove leading path
    pattern = pattern.replace(/^.+[\\\\/]/, '')
    // remove extension
    pattern = pattern.replace(/\\.[^.]+$/, '')
    // validate pattern
    if (!MODEL_PATTERN_REGEX.test(pattern)) {
      throw Error(
        "[models] Invalid model filename pattern: " + modelFilename + "\\n" +
        "It has to comply with the following regex: " + MODEL_PATTERN_REGEX.toString() +
        " with '[id]' instead of '*'")
    }
    return pattern
  `
  if (precompiled) {
    // for usage in the generated code
    if (typeof functionName !== 'string') throw Error('functionName has to be a string')
    // guard from possible injections
    if (!/^[a-zA-Z_]+$/.test(functionName)) throw Error('functionName can only contain letters and an underscore')
    // get rid of the placeholder since we just throw runtime errors
    functionBody = functionBody.replace('/* $1 */', '')
    return `
      function ${functionName} () {
        ${functionBody}
      }
    `
  } else {
    // for usage in the babel plugin itself
    // replace placeholder with $import to build a code frame error at compile time
    functionBody = functionBody.replace('/* $1 */', 'const $import = arguments[1]')
    functionBody = functionBody.replace('throw Error', 'throw $import.buildCodeFrameError')
    return new Function(functionBody) // eslint-disable-line no-new-func
  }
}

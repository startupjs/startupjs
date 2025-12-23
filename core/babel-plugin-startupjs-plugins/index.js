const { statSync } = require('fs')
const { addDefault, addNamespace } = require('@babel/helper-module-imports')
const {
  getRelativePluginImports, getRelativeConfigImport, getConfigFilePaths,
  getRelativeModelImports, getFeatures, getRelativeModelPath
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

  return {
    visitor: {
      Program: ($program, { file }) => {
        const filename = file.opts.filename
        let triggered
        for (const $import of $program.get('body')) {
          if (!$import.isImportDeclaration()) continue
          if (isVirtualImport($import, VIRTUAL_CONFIG_IMPORT_REGEX)) {
            loadVirtualConfig($import, { $program, filename, t, root: options.root })
            triggered = true
            continue
          } else if (isVirtualImport($import, VIRTUAL_PLUGINS_IMPORT_REGEX)) {
            loadVirtualPlugins($import, { $program, filename, t, template, root: options.root })
            triggered = true
            continue
          } else if (isVirtualImport($import, VIRTUAL_MODELS_IMPORT_REGEX)) {
            if (options.useRequireContext) {
              loadVirtualModelsRequireContext($import, { $program, filename, t, template, root: options.root })
              triggered = true
              continue
            } else {
              loadVirtualModels($import, { $program, filename, t, template, root: options.root })
              triggered = true
              continue
            }
          } else if (isVirtualImport($import, VIRTUAL_FEATURES_IMPORT_REGEX)) {
            loadVirtualFeatures($import, { $program, t, template, root: options.root })
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

function loadVirtualModels ($import, { $program, filename, t, template, root }) {
  const buildModelsConst = template('const %%name%% = %%models%%')
  validateModelsImport($import)

  // find all models in the project's `models` directory
  const modelImports = getRelativeModelImports(filename, root)
  const relativeModelPath = getRelativeModelPath(filename, root)

  let modelPatterns = {}
  for (const filePath of modelImports) {
    const modelPattern = getModelPattern(filePath, relativeModelPath, $import)
    if (modelPattern === null) continue // ignore files which start with a dash
    modelPatterns[modelPattern] = filePath
  }
  modelPatterns = sanitizeAndMergeModelPatterns(modelPatterns, $import)

  const models = t.objectExpression([])
  for (const modelPattern in modelPatterns) {
    const parts = modelPatterns[modelPattern]
    const fileParts = parts.map(part => {
      if (part.type === 'model') return addNamespaceImport($program, part.value)
      else {
        const partImport = addDefaultImport($program, part.value)
        return t.objectExpression([t.objectProperty(t.stringLiteral(part.name), partImport)])
      }
    })
    const objectAssign = t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('assign')), [
      t.objectExpression([]), ...fileParts
    ])
    models.properties.push(t.objectProperty(
      t.stringLiteral(modelPattern),
      objectAssign
    ))
  }

  // replace the original magic import with the generated code
  const name = $import.get('specifiers.0.local').node.name
  $import.remove()
  const modelsConst = buildModelsConst({ name, models })
  const $lastImport = $program.get('body').filter($i => $i.isImportDeclaration()).pop()
  $lastImport.insertAfter(modelsConst)
}

function loadVirtualModelsRequireContext ($import, { $program, filename, t, template, root }) {
  const buildModelsConst = template(/* js */`
    const __modelsContext = require.context(%%folder%%, true, /\\.[mc]?[jt]sx?$/)
    const %%name%% = (() => {
      let modelPatterns = __modelsContext.keys().reduce(
        (res, filePath) => {
          const pattern = __getModelPattern(filePath, '.') // context returns relative paths from the context folder
          if (pattern === null) return res // ignore files which start with a dash
          return { ...res, [pattern]: filePath }
        },
        {}
      )
      modelPatterns = __sanitizeAndMergeModelPatterns(modelPatterns)
      const res = {}
      for (const [modelPattern, parts] of Object.entries(modelPatterns)) {
        const fileParts = parts.map(part => {
          // if it's a model file, we return all its exports
          if (part.type === 'model') return __modelsContext(part.value)
          // otherwise it's a part of the model moved out into a separate file and we return only the default export
          else return { [part.name]: __modelsContext(part.value).default }
        })
        res[modelPattern] = Object.assign({}, ...fileParts)
      }
      return res
    })()
    ${getModelPatternFunction({ precompiled: true, functionName: '__getModelPattern' })}
    ${sanitizeAndMergeModelPatternsFunction({ precompiled: true, functionName: '__sanitizeAndMergeModelPatterns' })}
  `)
  validateModelsImport($import)

  const relativeModelPath = getRelativeModelPath(filename, root)

  // remove the original magic import
  const name = $import.get('specifiers.0.local').node.name
  $import.remove()

  const modelsConst = buildModelsConst({
    name,
    folder: t.stringLiteral(relativeModelPath)
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
    importedType: 'es6',
    importPosition: 'after'
  })
}

function addNamespaceImport ($program, sourceName) {
  return addNamespace($program, sourceName, {
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
const sanitizeAndMergeModelPatterns = sanitizeAndMergeModelPatternsFunction()

// IMPORTANT: this function is used in both in the babel plugin itself and
//            can be output to the generated code when using require.context for models.
//            - default implementation is for usage in the generated code and throws runtime errors.
//            - when using in babel instead of `throw Error` we do `throw $import.buildCodeFrameError`
function getModelPatternFunction ({ precompiled = false, functionName = '__getModelPattern' } = {}) {
  const BS = '\\' // since we write JS code inside template literals, we need to escape backslash
  let functionBody = /* js */`
    const modelFilename = arguments[0]
    const modelFolder = arguments[1]
    /* $2 */
    const MODEL_PATTERN_REGEX = /^[a-zA-Z0-9$_*.]+$/
    let pattern = modelFilename
    if (/${BS}*/.test(pattern)) {
      throw Error("[models] Instead of '*' in model filename use '[id]'. Got: " + modelFilename)
    }
    // replace [id] with *
    pattern = pattern.replace(/${BS}[[^${BS}]]*${BS}]/g, '*')
    // remove leading model folder path
    pattern = pattern.replace(modelFolder + '/', '')
    // remove extension
    pattern = pattern.replace(/${BS}.[^.]+$/, '')
    // replace / with .
    pattern = pattern.replace(/[${BS}${BS}/]/g, '.')
    // if pattern has a section which starts with a dash, ignore it (return null)
    if (pattern.split('.').some(section => section.startsWith('-'))) return null
    // validate pattern
    if (!MODEL_PATTERN_REGEX.test(pattern)) {
      throw Error(
        "[models] Invalid model filename pattern: " + modelFilename + "${BS}n" +
        "It has to comply with the following regex: " + MODEL_PATTERN_REGEX.toString() +
        " with '[id]' instead of '*'")
    }
    // 'index' is a special case -- root model
    if (pattern === 'index') pattern = ''
    // 'index' as the last part of the path is a special case
    if (/${BS}.index$/.test(pattern)) pattern = pattern.replace(/${BS}.index$/, '')
    return pattern
  `
  if (precompiled) {
    // for usage in the generated code
    if (typeof functionName !== 'string') throw Error('functionName has to be a string')
    // guard from possible injections
    if (!/^[a-zA-Z_]+$/.test(functionName)) throw Error('functionName can only contain letters and an underscore')
    // get rid of the placeholder since we just throw runtime errors
    functionBody = functionBody.replace('/* $2 */', '')
    return `
      function ${functionName} () {
        ${functionBody}
      }
    `
  } else {
    // for usage in the babel plugin itself
    // replace placeholder with $import to build a code frame error at compile time
    functionBody = functionBody.replace('/* $2 */', 'const $import = arguments[2]')
    functionBody = functionBody.replace(/throw Error/g, 'throw $import.buildCodeFrameError')
    return new Function(functionBody) // eslint-disable-line no-new-func
  }
}

// IMPORTANT: this function is used in both in the babel plugin itself and
//            can be output to the generated code when using require.context for models.
//            - default implementation is for usage in the generated code and throws runtime errors.
//            - when using in babel instead of `throw Error` we do `throw $import.buildCodeFrameError`
function sanitizeAndMergeModelPatternsFunction ({ precompiled = false, functionName = '__sanitizeAndMergeModelPatterns' } = {}) {
  const BS = '\\' // since we write JS code inside template literals, we need to escape backslash
  let functionBody = /* js */`
    const modelPatterns = arguments[0]
    /* $1 */
    const res = {}
    for (const [modelPattern, value] of Object.entries(modelPatterns)) {
      const sections = modelPattern.split('.')
      const lastSection = sections.pop()
      let pattern = sections.join('.')
      let type
      let method = 'push'
      if (/^${BS}$${BS}$/.test(lastSection)) type = 'aggregation'
      else if (lastSection === 'schema') type = 'schema'
      else if (lastSection === 'access') type = 'access'
      else {
        type = 'model'
        pattern = modelPattern
        method = 'unshift' // if it's a model file, we want to be first so that the parts can override it if needed
      }
      res[pattern] ??= []
      res[pattern][method]({ type, name: lastSection, value })
    }
    return res
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
    functionBody = functionBody.replace(/throw Error/g, 'throw $import.buildCodeFrameError')
    return new Function(functionBody) // eslint-disable-line no-new-func
  }
}

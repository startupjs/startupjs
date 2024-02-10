const { statSync } = require('fs')
const { addDefault } = require('@babel/helper-module-imports')
const { getRelativePluginImports, getRelativeConfigImport, getConfigFilePaths } = require('./loader')

const VIRTUAL_CONFIG_IMPORT_REGEX = /(?:^|\/)startupjs\.config\.virtual\.js$/
// const VIRTUAL_MODEL_IMPORT_REGEX = /(?:^|\/)startupjs\.model\.virtual\.js$/
const VIRTUAL_PLUGINS_IMPORT_REGEX = /(?:^|\/)startupjs\.plugins\.virtual\.js$/

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

  // dummy usage of plugins to make sure they are not removed by dead code elimination
  const pluginsConst = buildPluginsConst({ name, plugins: t.arrayExpression(plugins) })
  const $lastImport = $program.get('body').filter($i => $i.isImportDeclaration()).pop()
  $lastImport.insertAfter(pluginsConst)
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
  if ($specifiers.length === 0 || $specifiers.length > 1) {
    throw $import.buildCodeFrameError('Expected a single default import')
  }
  if (!$specifiers[0].isImportDefaultSpecifier()) {
    throw $import.buildCodeFrameError('Expected a single default import')
  }
}

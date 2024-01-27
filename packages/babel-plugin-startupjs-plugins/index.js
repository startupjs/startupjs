const { statSync } = require('fs')
const { addDefault } = require('@babel/helper-module-imports')
const { getRelativePluginImports, getRelativeConfigImport, getConfigFilePaths } = require('./loader')

const LOAD_CONFIG_IMPORT_REGEX = /(?:^|\/)startupjs\.config\.magic\.js$/

module.exports = function (api, options) {
  const { types: t, template } = api
  const buildDummyPluginsUsage = template('(() => {})(%%plugins%%)')

  // watch startupjs.config.js files for changes
  for (const configFilePath of getConfigFilePaths(options.root)) {
    api.cache.using(() => mtime(configFilePath))
    api.addExternalDependency(configFilePath)
  }

  // private vars to share state inside visitor. You must reset them in pre()
  let done, $program, filename

  return {
    pre () {
      // reset all private vars
      ;[done, $program, filename] = []
    },
    visitor: {
      Program: ($this, { file }) => {
        $program = $this
        filename = file.opts.filename
      },
      ImportDeclaration: ($this) => {
        if (done) return
        if (!isMagicConfigImport($this)) return

        // traverse though the packages tree and find all module, plugins and configs for them
        const pluginImports = getRelativePluginImports(filename, options.root)

        const plugins = []
        for (const pluginImport of pluginImports) {
          plugins.push(addDefaultImport($program, pluginImport))
        }

        // dummy usage of plugins to make sure they are not removed by dead code elimination
        const dummyPluginsUsage = buildDummyPluginsUsage({ plugins: t.arrayExpression(plugins) })
        const $lastImport = $program.get('body').filter($i => $i.isImportDeclaration()).pop()
        $lastImport.insertAfter(dummyPluginsUsage)

        // add import of startupjs.config.js
        const configFileImport = getRelativeConfigImport(filename, options.root)

        // if startupjs.config.js exists in the project, replace the magic import with it
        if (configFileImport) {
          $this.get('source').replaceWith(t.stringLiteral(configFileImport))
        }

        done = true
      }
    }
  }
}

function addDefaultImport ($program, sourceName) {
  return addDefault($program, sourceName, {
    importedInterop: 'uncompiled',
    importPosition: 'after'
  })
}

// Handle only magic import which imports a magic function
function isMagicConfigImport ($import) {
  return LOAD_CONFIG_IMPORT_REGEX.test($import.get('source').node.value)
}

function mtime (filePath) {
  try {
    return statSync(filePath).mtimeMs
  } catch {
    return null
  }
}

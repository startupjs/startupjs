const { addDefault } = require('@babel/helper-module-imports')
const { getPluginImports } = require('./loader')

const MAGIC_LIBRARIES = [
  'startupjs/registry', 'startupjs/registry.js', '@startupjs/registry', '@startupjs/registry.js'
]
const MAGIC_FUNCTION = 'createProject'

module.exports = function ({ types: t, template }) {
  const buildDummyPluginsUsage = template('(() => {})(%%plugins%%)')

  let done
  let $program

  return {
    post () {
      done = undefined
      $program = undefined
    },
    visitor: {
      Program: ($this) => {
        $program = $this
      },
      ImportDeclaration: ($this, { opts: { root, env } }) => {
        if (done) return
        if (!validateImport($this)) return

        // traverse though the packages tree and find all module, plugins and configs for them
        const pluginImports = getPluginImports(root)

        const plugins = []
        for (const pluginImport of pluginImports) {
          plugins.push(addDefaultImport($program, pluginImport))
        }

        // replace magic import with the 'packages' constant
        const dummyPluginsUsage = buildDummyPluginsUsage({ plugins: t.arrayExpression(plugins) })

        const $lastImport = $program
          .get('body')
          .filter($i => $i.isImportDeclaration())
          .pop()
        $lastImport.insertAfter(dummyPluginsUsage)

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
function validateImport ($import) {
  if (!MAGIC_LIBRARIES.includes($import.node.source.value)) return
  for (const $specifier of $import.get('specifiers')) {
    if (!$specifier.isImportSpecifier()) continue
    const { imported } = $specifier.node
    if (imported.name === MAGIC_FUNCTION) return true
  }
}

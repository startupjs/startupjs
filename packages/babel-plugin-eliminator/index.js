const { getVisitorToCollectInitialReferences, removeUnusedReferences } = require('./lib/deadCodeEliminator.js')
const { getVisitorToRemoveOtherEnvs } = require('./lib/removeOtherEnvs.js')

module.exports = function babelPluginEliminator (
  { template, types: t },
  { removeExports = [], keepExports = [], trimObjects = [], transformFunctionCalls = [] }
) {
  return {
    visitor: {
      Program: {
        enter ($this, { file }) {
          const refs = new Set()
          const triggerRemoved = createTrigger()
          const filename = file.opts.filename

          // Keep variables that're referenced
          $this.traverse({
            ...getVisitorToCollectInitialReferences(refs),
            ...getVisitorToRemoveOtherEnvs({
              template, filename, removeExports, keepExports, trimObjects, triggerRemoved, transformFunctionCalls, t
            })
          })

          if (!triggerRemoved.wasTriggered()) {
            // No server-specific exports found and no object keys from magic functions removed
            // No need to clean unused references then
            return
          }

          removeUnusedReferences($this, refs)

          // TODO: investigate, refactor and remove this hardcode
          removeDummyImports($this)
        }
      }
    }
  }
}

function createTrigger () {
  let triggered = false
  function trigger () { triggered = true }
  trigger.wasTriggered = () => triggered
  return trigger
}

// TODO: investigate, refactor and remove this hardcode
//       It's currently needed since the magic `pug` import from `startupjs` is not getting removed
const MAGIC_LIBRARY = 'startupjs'
const compilers = ['pug']
function removeDummyImports ($program) {
  const res = {}
  for (const $import of $program.get('body')) {
    if (!$import.isImportDeclaration()) continue
    if ($import.node.source.value !== MAGIC_LIBRARY) continue
    for (const $specifier of $import.get('specifiers')) {
      if (!$specifier.isImportSpecifier()) continue
      const { local, imported } = $specifier.node
      if (compilers.includes(imported.name)) {
        res[local.name] = true
        $specifier.remove()
      }
    }
    if ($import.get('specifiers').length === 0) $import.remove()
  }
  return res
}

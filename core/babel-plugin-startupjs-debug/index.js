/**
 * replace:
 *   observer(...)
 * with:
 *   observer.__wrapObserverMeta(observer.__makeObserver(...))
 */
const template = require('@babel/template').default
const t = require('@babel/types')

const GLOBAL_OBSERVER_LIBRARY = 'startupjs'
const GLOBAL_OBSERVER_DEFAULT_NAME = 'observer'

const buildFixedObserver = template(`
  %%observer%%.__wrapObserverMeta(%%observer%%.__makeObserver(%%args%%))
`)

module.exports = function (babel, opts) {
  opts = {
    fixObserverHotReloading: true,
    addFilenamesToObserver: true,
    ...opts
  }
  let OBSERVER_NAME
  let FILENAME

  const earlyVisitor = {
    ImportDeclaration ($this) {
      if ((opts.fixObserverHotReloading || opts.addFilenamesToObserver) && !OBSERVER_NAME) {
        OBSERVER_NAME = maybeGetObserverName($this)
      }
    },
    CallExpression ($this) {
      if ((opts.fixObserverHotReloading || opts.addFilenamesToObserver) && OBSERVER_NAME) {
        maybeReplaceObserver($this, {
          observerName: OBSERVER_NAME,
          filename: FILENAME,
          fixObserverHotReloading: opts.fixObserverHotReloading,
          addFilenamesToObserver: opts.addFilenamesToObserver
        })
      }
    }
  }

  return {
    pre () {
      OBSERVER_NAME = undefined
      FILENAME = undefined
    },
    visitor: {
      Program ($this, state) {
        FILENAME = state.file?.opts?.filename
        $this.traverse(earlyVisitor)
      }
    }
  }
}

function maybeGetObserverName ($import, {
  observerLibrary = GLOBAL_OBSERVER_LIBRARY,
  observerDefaultName = GLOBAL_OBSERVER_DEFAULT_NAME
} = {}) {
  if ($import.node.source.value !== observerLibrary) return
  for (const $specifier of $import.get('specifiers')) {
    if (!$specifier.isImportSpecifier()) continue
    const { local, imported } = $specifier.node
    if (imported.name === observerDefaultName) return local.name
  }
}

function maybeReplaceObserver ($callExpression, {
  observerName,
  filename = 'ERROR_NON_IDENTIFIABLE',
  fixObserverHotReloading,
  addFilenamesToObserver
}) {
  const $callee = $callExpression.get('callee')
  if (!($callee.isIdentifier() && $callee.node.name === observerName)) return
  if (addFilenamesToObserver) {
    const args = $callExpression.node.arguments
    let object
    if (t.isObjectExpression(args[1])) {
      object = args[1]
    } else {
      object = t.objectExpression([])
      args.push(object)
    }
    object.properties.push(t.objectProperty(t.identifier('filename'), t.stringLiteral(filename)))
  }
  if (fixObserverHotReloading) {
    const $newObserver = buildFixedObserver({
      observer: $callExpression.get('callee').node,
      args: $callExpression.node.arguments
    })
    $callExpression.replaceWith($newObserver)
  }
}

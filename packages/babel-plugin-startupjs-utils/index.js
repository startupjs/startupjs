const template = require('@babel/template').default
const t = require('@babel/types')

const FLAGS = {
  observerCache: {
    path: '@startupjs/cache/enabled',
    default: false
  },
  signals: {
    path: '@startupjs/signals/enabled.js',
    default: false
  }
}

const buildConst = template(`
  const %%variable%% = %%value%%
`)

module.exports = function (babel, opts) {
  let $program
  let handledFlags

  return {
    pre () {
      $program = undefined
      handledFlags = {}
    },
    visitor: {
      Program ($this) {
        $program = $this
      },
      ImportDeclaration ($this) {
        for (const flag in FLAGS) {
          if (handledFlags[flag]) continue
          const identifier = maybeGetFlagIdentifier($this, { magicPath: FLAGS[flag].path })
          if (!identifier) continue
          const enabled = (opts[flag] != null ? opts[flag] : FLAGS[flag].default)
          insertAfterImports($program, buildConst({
            variable: identifier,
            value: t.booleanLiteral(enabled)
          }))
          $this.remove()
          handledFlags[flag] = true
          return // import doesn't exist anymore so we have to stop any processing of this node
        }
      }
    }
  }
}

function maybeGetFlagIdentifier ($import, { magicPath } = {}) {
  if ($import.node.source.value !== magicPath) return
  for (const $specifier of $import.get('specifiers')) {
    if (!$specifier.isImportDefaultSpecifier()) continue
    return $specifier.node.local
  }
}

function insertAfterImports ($program, expressionStatement) {
  const lastImport = $program
    .get('body')
    .filter($i => $i.isImportDeclaration())
    .pop()

  if (lastImport) {
    lastImport.insertAfter(expressionStatement)
  } else {
    $program.unshift(expressionStatement)
  }
}

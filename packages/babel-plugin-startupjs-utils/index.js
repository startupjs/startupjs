const template = require('@babel/template').default
const t = require('@babel/types')

const GLOBAL_CACHE_ENABLED_LIBRARY = '@startupjs/cache/enabled'

const buildConst = template(`
  const %%variable%% = %%value%%
`)

module.exports = function (babel, opts) {
  opts.observerCache = (opts.observerCache != null ? opts.observerCache : false)
  let $program
  let handledCache

  return {
    pre () {
      $program = undefined
      handledCache = undefined
    },
    visitor: {
      Program ($this) {
        $program = $this
      },
      ImportDeclaration ($this) {
        if (!handledCache) {
          const local = maybeGetCacheEnabledIdentifier($this)
          if (local) {
            insertAfterImports($program, buildConst({
              variable: local,
              value: t.booleanLiteral(opts.observerCache)
            }))
            $this.remove()
            handledCache = true
          }
        }
      }
    }
  }
}

function maybeGetCacheEnabledIdentifier ($import, {
  cacheEnabledLibrary = GLOBAL_CACHE_ENABLED_LIBRARY
} = {}) {
  if ($import.node.source.value !== cacheEnabledLibrary) return
  for (const $specifier of $import.get('specifiers')) {
    if (!$specifier.isImportDefaultSpecifier()) continue
    const { local } = $specifier.node
    return local
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

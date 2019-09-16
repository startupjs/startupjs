/**
 * Replaces function call with 2 function calls of subfunctions taken from the original function
 * Example:
 *   import { observer } from 'startupjs'
 *   export default observer(function App () { return null })
 *   | | |
 *   V V V
 *
 *   import { observer } from 'startupjs'
 *   export default observer.__wrapObserverMeta(observer.__makeObserver(function App () { return null }))
 */

const DEFAULT_LIBRARY_NAME = 'startupjs'
const DEFAULT_FUNCTION_NAME = 'observer'
const DEFAULT_SUB_OUTER_FUNCTION_NAME = '__wrapObserverMeta'
const DEFAULT_SUB_INNER_FUNCTION_NAME = '__makeObserver'

module.exports = function ({ types: t }) {
  let hasLibraryImport = false
  let localFunctionName = null

  return {
    post () {
      hasLibraryImport = false
      localFunctionName = null
    },
    visitor: {
      ImportDeclaration (path, state) {
        if (hasLibraryImport) return
        let node = path.node

        let libraryName = (state.opts && state.opts.libraryName) || DEFAULT_LIBRARY_NAME
        let functionName = (state.opts && state.opts.functionName) || DEFAULT_FUNCTION_NAME

        if (!(t.isStringLiteral(node.source) && node.source.value === libraryName)) return

        for (let specifier of node.specifiers) {
          if (
            t.isImportSpecifier(specifier) &&
            specifier.imported &&
            specifier.imported.name === functionName
          ) {
            hasLibraryImport = true
            localFunctionName = (specifier.local && specifier.local.name) || functionName
            break
          }
        }

        // specifier = node.specifiers[0];

        // randomSpecifier = t.ImportDefaultSpecifier(
        //   path.scope.generateUidIdentifier()
        // );

        // node.specifiers = [specifier || randomSpecifier];
      },

      CallExpression (path, state) {
        if (!hasLibraryImport) return
        let node = path.node
        if (!(t.isIdentifier(node.callee) && node.callee.name === localFunctionName)) return

        let subOuterFunctionName = (state.opts && state.opts.subOuterFunctionName) || DEFAULT_SUB_OUTER_FUNCTION_NAME
        let subInnerFunctionName = (state.opts && state.opts.subInnerFunctionName) || DEFAULT_SUB_INNER_FUNCTION_NAME

        node.callee = t.memberExpression(
          t.identifier(localFunctionName),
          t.identifier(subOuterFunctionName)
        )

        let origArguments = node.arguments
        node.arguments = [
          t.callExpression(
            t.memberExpression(
              t.identifier(localFunctionName),
              t.identifier(subInnerFunctionName)
            ),
            origArguments
          )
        ]
      }
    }
  }
}

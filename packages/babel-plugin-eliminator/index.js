const REMOVAL_INDICATOR = 'undefined'

module.exports = function babelPluginEliminator ({ template }) {
  const buildIndicator = template(REMOVAL_INDICATOR)
  const buildNamedExportIndicator = template(`export var %%name%% = ${REMOVAL_INDICATOR}`)
  const insertIndicator = ($path, name) => $path.insertBefore(buildNamedExportIndicator({ name }))

  return {
    visitor: {
      Program: {
        enter ($this, state) {
          state.refs = new Set()
          state.removedExports = new Set()
          state.removedFunctionKeys = new Set()

          const shouldRemoveExport = name => {
            const removeExports = state.opts.removeExports || []
            const keepExports = state.opts.keepExports || []
            if (removeExports.length > 0 && keepExports.length > 0) {
              throw new Error('You cannot specify both `removeExports` and `keepExports`')
            }
            if (removeExports.length > 0) return removeExports.includes(name)
            if (keepExports.length > 0) return !keepExports.includes(name)
            return false
          }

          const markImport = createMarkImport(state)
          const markFunction = createMarkFunction(state)

          const functionsMeta = state.opts.keepObjectKeysOfFunction || {}
          const usedFunctions = {}

          // Keep variables that're referenced
          $this.traverse({
            // No idea why the second argument is always undefined
            // It should have been `state`
            VariableDeclarator ($this) {
              const $id = $this.get('id')
              if ($id.isIdentifier()) {
                if (isIdentifierReferenced($id)) state.refs.add($id)
              } else if ($id.isObjectPattern()) {
                const $properties = $id.get('properties')
                for (const $property of $properties) {
                  let $local
                  if ($property.isObjectProperty()) {
                    $local = $property.get('value')
                  } else if ($property.isRestElement()) {
                    $local = $property.get('argument')
                  } else {
                    throw new Error('invariant')
                  }
                  if (isIdentifierReferenced($local)) state.refs.add($local)
                }
              } else if ($id.isArrayPattern()) {
                const $elements = $id.get('elements')
                for (const $element of $elements) {
                  let $local
                  if ($element.isIdentifier()) {
                    $local = $element
                  } else if ($element.isRestElement()) {
                    $local = $element.get('argument')
                  } else {
                    continue
                  }
                  if (isIdentifierReferenced($local)) state.refs.add($local)
                }
              }
            },

            FunctionDeclaration: markFunction,
            FunctionExpression: markFunction,
            ArrowFunctionExpression: markFunction,
            ImportSpecifier: markImport,
            ImportDefaultSpecifier: markImport,
            ImportNamespaceSpecifier: markImport,

            ExportNamedDeclaration ($this) {
              // 1. handle re-exports: export { preload } from './foo'
              if ($this.get('specifiers').length > 0) {
                for (const $specifier of $this.get('specifiers')) {
                  const $exported = $specifier.get('exported')
                  if (!$exported.isIdentifier()) continue
                  const { name } = $exported.node
                  if (!shouldRemoveExport(name)) continue
                  insertIndicator($this, name)
                  state.removedExports.add(name)
                  $specifier.remove()
                }
                if ($this.get('specifiers').length === 0) $this.remove()
                return
              }

              const $declaration = $this.get('declaration')
              if (!$declaration.node) return

              // 2. handle export var preload = function () {}
              if ($declaration.isVariableDeclaration()) {
                for (const $declarator of $declaration.get('declarations')) {
                  const { name } = $declarator.get('id').node
                  if (!shouldRemoveExport(name)) continue
                  if (!$declarator.node.init?.type.includes('Function')) continue // ArrowFunctionExpression or FunctionExpression
                  insertIndicator($this, name)
                  state.removedExports.add(name)
                  $declarator.remove()
                }
                return
              }

              // 3. handle export function preload () {}
              if ($declaration.isFunctionDeclaration()) {
                const { name } = $declaration.get('id').node
                if (!shouldRemoveExport(name)) return
                insertIndicator($this, name)
                state.removedExports.add(name)
                $this.remove()
                return
              }

              return undefined // explicit return for better switch conditions above
            },

            ExportDefaultDeclaration ($this) {
              const name = 'default'
              if (!shouldRemoveExport(name)) return
              // Replace only the value of the export default
              state.removedExports.add(name)
              $this.get('declaration').replaceWith(buildIndicator())
            },

            // find magic functions used in this file
            ImportDeclaration ($this) {
              for (const functionName in functionsMeta) {
                const { magicImports } = functionsMeta[functionName]
                if (!magicImports.includes($this.node.source.value)) continue
                for (const $specifier of $this.get('specifiers')) {
                  if (!$specifier.isImportSpecifier()) continue
                  if ($specifier.get('imported').node.name !== functionName) continue
                  const localName = $specifier.get('local').node.name
                  usedFunctions[localName] = functionName
                }
              }
            },

            // remove specific object keys from magic functions
            CallExpression ($this) {
              const $callee = $this.get('callee')
              if (!$callee.isIdentifier()) return
              const originalFunctionName = usedFunctions[$callee.node.name]
              if (!originalFunctionName) return
              const {
                keepKeys = [],
                targetObjectJsonPath = '$',
                ensureOnlyKeys = []
              } = functionsMeta[originalFunctionName]

              // get first argument of the magic function
              const $arg = $this.get('arguments.0')
              if (!($arg.isObjectExpression() || $arg.isArrayExpression())) return

              // find the object to remove keys from - go down the json path
              const sections = targetObjectJsonPath.trim().split('.') // $.plugins.*
              let res = [$arg]
              for (const section of sections) {
                const newRes = []
                for (const $item of res) {
                  // if section is '$' - use the item itself
                  if (section === '$') {
                    newRes.push($item)
                  // if section is '*' - use all items of the array or all properties of the object
                  } else if (section === '*') {
                    if ($item.isObjectExpression()) {
                      newRes.push(...$item.get('properties').map($prop => $prop.get('value')))
                    } else if ($item.isArrayExpression()) {
                      newRes.push(...$item.get('elements'))
                    }
                  // if section is a string - use the property (or array index) with the name (index) matching the section
                  } else if (section.length > 0 && section.trim() === section) {
                    if ($item.isObjectExpression()) {
                      // Find a property with the name matching the section
                      const $prop = $item.get('properties').find($prop =>
                        $prop.get('key').isIdentifier({ name: section })
                      )
                      if ($prop) newRes.push($prop.get('value'))
                    } else if ($item.isArrayExpression()) {
                      // If the section is a numeric index, access the array element
                      const index = parseInt(section, 10)
                      if (isNaN(index)) continue
                      const $element = $item.get('elements')[index]
                      if ($element) newRes.push($element)
                    }
                  // if section is not '$', '*' or a string - throw an error since this JSON path section is not supported
                  } else {
                    throw Error(`targetObjectJsonPath is not supported: ${targetObjectJsonPath}.\n` +
                      "It can only contain '$', '*', or string sections separated by dots.")
                  }
                }
                res = newRes
              }

              // remove keys from objects we found
              for (const $targetObject of res) {
                if (!$targetObject.isObjectExpression()) {
                  throw $targetObject.buildCodeFrameError('item at targetObjectJsonPath must be an object')
                }
                for (const $property of $targetObject.get('properties')) {
                  const $key = $property.get('key')
                  if (!$key.isIdentifier()) continue
                  const keyName = $key.node.name
                  if (ensureOnlyKeys.length > 0 && !ensureOnlyKeys.includes(keyName)) {
                    throw $property.buildCodeFrameError(`\n${originalFunctionName}(): key is not listed in ensureOnlyKeys: '${keyName}'.\n` +
                      'You can only use keys listed in `ensureOnlyKeys`:\n' +
                      ensureOnlyKeys.map(k => `  - ${k}`).join('\n'))
                  }
                  if (keepKeys.length > 0 && !keepKeys.includes(keyName)) {
                    state.removedFunctionKeys.add(originalFunctionName + '/' + keyName)
                    $property.remove()
                  }
                }
              }
            }
          })

          if (state.removedExports.size === 0 && state.removedFunctionKeys.size === 0) {
            // No server-specific exports found and no object keys from magic functions removed
            // No need to clean unused references then
            return
          }

          if (state.opts.done) {
            state.opts.done(state)
          }

          cleanUnusedReferences($this, state)
        }
      }
    }
  }
}

function cleanUnusedReferences ($program, { refs }) {
  let count

  function sweepFunction ($path) {
    const ident = getIdentifier($path)
    if (
      ident?.node &&
      refs.has(ident) &&
      !isIdentifierReferenced(ident)
    ) {
      ++count

      if (
        $path.parentPath.isAssignmentExpression() ||
        $path.parentPath.isVariableDeclarator()
      ) {
        $path.parentPath.remove()
      } else {
        $path.remove()
      }
    }
  }

  function sweepImport ($path) {
    const local = $path.get('local')
    if (refs.has(local) && !isIdentifierReferenced(local)) {
      ++count
      $path.remove()
      if ($path.parent.specifiers.length === 0) {
        $path.parentPath.remove()
      }
    }
  }

  // Traverse again to remove unused dependencies
  // We do this at least once
  // If something is removed `count` will be true so it will run again
  // Otherwise it exists the loop
  do {
    $program.scope.crawl()
    count = 0

    $program.traverse({
      VariableDeclarator ($this) {
        if ($this.node.id.type === 'Identifier') {
          const local = $this.get('id')
          if (refs.has(local) && !isIdentifierReferenced(local)) {
            ++count
            $this.remove()
          }
        } else if ($this.node.id.type === 'ObjectPattern') {
          const pattern = $this.get('id')

          const beforeCount = count
          const properties = pattern.get('properties')
          properties.forEach(p => {
            const local = p.get(
              p.node.type === 'ObjectProperty'
                ? 'value'
                : p.node.type === 'RestElement'
                  ? 'argument'
                  : (function () {
                      throw new Error('invariant')
                    })()
            )

            if (refs.has(local) && !isIdentifierReferenced(local)) {
              ++count
              p.remove()
            }
          })

          if (
            beforeCount !== count &&
            pattern.get('properties').length < 1
          ) {
            $this.remove()
          }
        } else if ($this.node.id.type === 'ArrayPattern') {
          const pattern = $this.get('id')

          const beforeCount = count
          const elements = pattern.get('elements')
          elements.forEach(e => {
            let local
            if (e.node?.type === 'Identifier') {
              local = e
            } else if (e.node?.type === 'RestElement') {
              local = e.get('argument')
            } else {
              return
            }

            if (refs.has(local) && !isIdentifierReferenced(local)) {
              ++count
              e.remove()
            }
          })

          if (
            beforeCount !== count &&
            pattern.get('elements').length < 1
          ) {
            $this.remove()
          }
        }
      },
      FunctionDeclaration: sweepFunction,
      FunctionExpression: sweepFunction,
      ArrowFunctionExpression: sweepFunction,
      ImportSpecifier: sweepImport,
      ImportDefaultSpecifier: sweepImport,
      ImportNamespaceSpecifier: sweepImport
    })
  } while (count)
}

function getIdentifier (path) {
  const parentPath = path.parentPath
  if (parentPath.type === 'VariableDeclarator') {
    const pp = parentPath
    const name = pp.get('id')
    return name.node.type === 'Identifier' ? name : null
  }

  if (parentPath.type === 'AssignmentExpression') {
    const pp = parentPath
    const name = pp.get('left')
    return name.node.type === 'Identifier' ? name : null
  }

  if (path.node.type === 'ArrowFunctionExpression') {
    return null
  }

  return path.node.id && path.node.id.type === 'Identifier'
    ? path.get('id')
    : null
}

function isIdentifierReferenced (ident) {
  const b = ident.scope.getBinding(ident.node.name)
  if (b?.referenced) {
    // Functions can reference themselves, so we need to check if there's a
    // binding outside the function scope or not.
    if (b.path.type === 'FunctionDeclaration') {
      return !b.constantViolations
        .concat(b.referencePaths)
        // Check that every reference is contained within the function:
        .every(ref => ref.findParent(p => p === b.path))
    }

    return true
  }
  return false
}

function createMarkFunction (state) {
  return function markFunction (path) {
    const ident = getIdentifier(path)
    if (ident?.node && isIdentifierReferenced(ident)) {
      state.refs.add(ident)
    }
  }
}

function createMarkImport (state) {
  return function markImport (path) {
    const local = path.get('local')
    if (isIdentifierReferenced(local)) {
      state.refs.add(local)
    }
  }
}

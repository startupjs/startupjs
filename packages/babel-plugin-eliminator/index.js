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

const createMarkFunction = state =>
  function markFunction (path) {
    const ident = getIdentifier(path)
    if (ident?.node && isIdentifierReferenced(ident)) {
      state.refs.add(ident)
    }
  }

const createMarkImport = state =>
  function markImport (path) {
    const local = path.get('local')
    if (isIdentifierReferenced(local)) {
      state.refs.add(local)
    }
  }

module.exports = function babelPluginEliminator ({ types: t }) {
  return {
    visitor: {
      Program: {
        enter (path, state) {
          state.refs = new Set()
          state.removedNamedExports = new Set()

          const namedExports = state.opts.namedExports || []

          const markImport = createMarkImport(state)
          const markFunction = createMarkFunction(state)

          // Keep variables that're referenced
          path.traverse({
            // No idea why the second argument is always undefine
            // It should have been `state`
            VariableDeclarator (variablePath) {
              if (variablePath.node.id.type === 'Identifier') {
                const local = variablePath.get('id')
                if (isIdentifierReferenced(local)) {
                  state.refs.add(local)
                }
              } else if (variablePath.node.id.type === 'ObjectPattern') {
                const pattern = variablePath.get('id')

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
                  if (isIdentifierReferenced(local)) {
                    state.refs.add(local)
                  }
                })
              } else if (variablePath.node.id.type === 'ArrayPattern') {
                const pattern = variablePath.get('id')

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

                  if (isIdentifierReferenced(local)) {
                    state.refs.add(local)
                  }
                })
              }
            },

            FunctionDeclaration: markFunction,
            FunctionExpression: markFunction,
            ArrowFunctionExpression: markFunction,
            ImportSpecifier: markImport,
            ImportDefaultSpecifier: markImport,
            ImportNamespaceSpecifier: markImport,

            ExportNamedDeclaration (path) {
              const insertIndicator = (path, exportName) => {
                path.insertBefore(
                  t.exportNamedDeclaration(
                    t.variableDeclaration('var', [
                      t.variableDeclarator(
                        t.identifier(exportName),
                        t.numericLiteral(1)
                      )
                    ])
                  )
                )
              }

              let shouldRemove = false

              // Handle re-exports: export { preload } from './foo'
              path.node.specifiers = path.node.specifiers.filter(spec => {
                if (spec.exported.type !== 'Identifier') {
                  return true
                }

                const { name } = spec.exported
                for (const namedExport of namedExports) {
                  if (name === namedExport) {
                    insertIndicator(path, namedExport)
                    state.removedNamedExports.add(namedExport)
                    return false
                  }
                }

                return true
              })

              const { declaration } = path.node

              // When none of Re-exports left, remove the path
              if (!declaration && path.node.specifiers.length === 0) {
                shouldRemove = true
              }

              if (declaration && declaration.type === 'VariableDeclaration') {
                declaration.declarations = declaration.declarations.filter(
                  declarator => {
                    for (const name of namedExports) {
                      if (
                        declarator.id.name === name &&
                        declarator.init?.type.includes('Function') // ArrowFunctionExpression or FunctionExpression
                      ) {
                        insertIndicator(path, name)
                        state.removedNamedExports.add(name)
                        return false
                      }
                    }
                    return true
                  }
                )
                if (declaration.declarations.length === 0) {
                  shouldRemove = true
                }
              }

              if (declaration && declaration.type === 'FunctionDeclaration') {
                for (const name of namedExports) {
                  // @ts-ignore
                  if (declaration.id.name === name) {
                    shouldRemove = true
                    state.removedNamedExports.add(name)
                    insertIndicator(path, name)
                  }
                }
              }

              if (shouldRemove) {
                path.remove()
              }
            }
          })

          if (state.removedNamedExports.size === 0) {
            // No server-specific exports found
            // No need to clean unused references then
            return
          }

          if (state.opts.done) {
            state.opts.done(state)
          }

          const refs = state.refs

          let count

          function sweepFunction (path) {
            const ident = getIdentifier(path)
            if (
              ident?.node &&
              refs.has(ident) &&
              !isIdentifierReferenced(ident)
            ) {
              ++count

              if (
                t.isAssignmentExpression(path.parentPath) ||
                t.isVariableDeclarator(path.parentPath)
              ) {
                path.parentPath.remove()
              } else {
                path.remove()
              }
            }
          }

          function sweepImport (path) {
            const local = path.get('local')
            if (refs.has(local) && !isIdentifierReferenced(local)) {
              ++count
              path.remove()
              if (path.parent.specifiers.length === 0) {
                path.parentPath.remove()
              }
            }
          }

          // Traverse again to remove unused dependencies
          // We do this at least once
          // If something is removed `count` will be true so it will run again
          // Otherwise it exists the loop
          do {
            path.scope.crawl()
            count = 0

            path.traverse({
              VariableDeclarator (variablePath) {
                if (variablePath.node.id.type === 'Identifier') {
                  const local = variablePath.get('id')
                  if (refs.has(local) && !isIdentifierReferenced(local)) {
                    ++count
                    variablePath.remove()
                  }
                } else if (variablePath.node.id.type === 'ObjectPattern') {
                  const pattern = variablePath.get('id')

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
                    variablePath.remove()
                  }
                } else if (variablePath.node.id.type === 'ArrayPattern') {
                  const pattern = variablePath.get('id')

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
                    variablePath.remove()
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
      }
    }
  }
}

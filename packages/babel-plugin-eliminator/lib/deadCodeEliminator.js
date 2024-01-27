exports.getVisitorToCollectInitialReferences = function getVisitorToCollectInitialReferences (refs) {
  function markFunction (path) {
    const ident = getIdentifier(path)
    if (ident?.node && isIdentifierReferenced(ident)) {
      refs.add(ident)
    }
  }

  function markImport (path) {
    const local = path.get('local')
    if (isIdentifierReferenced(local)) {
      refs.add(local)
    }
  }

  return {
    // No idea why the second argument is always undefined
    // It should have been `state`
    VariableDeclarator ($this) {
      const $id = $this.get('id')
      if ($id.isIdentifier()) {
        if (isIdentifierReferenced($id)) refs.add($id)
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
          if (isIdentifierReferenced($local)) refs.add($local)
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
          if (isIdentifierReferenced($local)) refs.add($local)
        }
      }
    },

    FunctionDeclaration: markFunction,
    FunctionExpression: markFunction,
    ArrowFunctionExpression: markFunction,
    ImportSpecifier: markImport,
    ImportDefaultSpecifier: markImport,
    ImportNamespaceSpecifier: markImport
  }
}

exports.removeUnusedReferences = function removeUnusedReferences ($program, refs) {
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

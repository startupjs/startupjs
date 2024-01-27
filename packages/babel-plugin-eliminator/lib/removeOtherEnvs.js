const REMOVAL_INDICATOR = 'undefined'

exports.getVisitorToRemoveOtherEnvs = function getVisitorToRemoveOtherEnvs ({
  template, filename, trimObjects, removeExports, keepExports, triggerRemoved
}) {
  const usedFunctions = {}

  const buildIndicator = template(REMOVAL_INDICATOR)
  const buildNamedExportIndicator = template(`export var %%name%% = ${REMOVAL_INDICATOR}`)
  const insertIndicator = ($path, name) => $path.insertBefore(buildNamedExportIndicator({ name }))

  function shouldRemoveExport (name) {
    if (removeExports.length > 0 && keepExports.length > 0) {
      throw new Error('You cannot specify both `removeExports` and `keepExports`')
    }
    if (removeExports.length > 0) return removeExports.includes(name)
    if (keepExports.length > 0) return !keepExports.includes(name)
    return false
  }

  return {
    ExportNamedDeclaration ($this) {
      // 1. handle re-exports: export { preload } from './foo'
      if ($this.get('specifiers').length > 0) {
        for (const $specifier of $this.get('specifiers')) {
          const $exported = $specifier.get('exported')
          if (!$exported.isIdentifier()) continue
          const { name } = $exported.node
          if (!shouldRemoveExport(name)) continue
          insertIndicator($this, name)
          triggerRemoved()
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
          triggerRemoved()
          $declarator.remove()
        }
        return
      }

      // 3. handle export function preload () {}
      if ($declaration.isFunctionDeclaration()) {
        const { name } = $declaration.get('id').node
        if (!shouldRemoveExport(name)) return
        insertIndicator($this, name)
        triggerRemoved()
        $this.remove()
        return
      }

      return undefined // explicit return for better switch conditions above
    },

    ExportDefaultDeclaration ($this) {
      const name = 'default'

      if (shouldRemoveExport(name)) {
        // Replace only the value of the export default
        triggerRemoved()
        $this.get('declaration').replaceWith(buildIndicator())
        return
      }

      // remove specific object keys from magic file's export default
      for (const trimObject of trimObjects) {
        const { magicFilenameRegex, magicExport } = trimObject
        if (!(magicExport && magicFilenameRegex)) continue
        if (magicExport !== name) continue
        if (!magicFilenameRegex?.test(filename)) continue
        removeKeysFromObject({
          $targetObject: $this.get('declaration'),
          debugName: filename + ' -> export default',
          onRemoveKey: triggerRemoved,
          ...trimObject
        })
      }
    },

    // find magic functions used in this file
    ImportDeclaration ($this) {
      for (const trimObject of trimObjects) {
        const { magicImports, functionName } = trimObject
        if (!(magicImports && functionName)) continue
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

      // same magic function can define multiple exclusion rules for different json paths
      for (const trimObject of trimObjects) {
        if (trimObject.functionName !== originalFunctionName) continue

        removeKeysFromObject({
          $targetObject: $this.get('arguments.0'), // first argument of the magic function
          debugName: trimObject.functionName + '()',
          onRemoveKey: triggerRemoved,
          ...trimObject
        })
      }
    }
  }
}

function removeKeysFromObject ({
  $targetObject,
  onRemoveKey,
  debugName = 'removeKeysFromObject',
  keepKeys = [],
  removeKeys = [],
  targetObjectJsonPath = '$',
  ensureOnlyKeys = []
}) {
  if (!($targetObject.isObjectExpression() || $targetObject.isArrayExpression())) return

  // find the object to remove keys from - go down the json path
  const sections = targetObjectJsonPath.trim().split('.') // $.plugins.*
  let res = [$targetObject]
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
        throw $property.buildCodeFrameError(`\n${debugName}: key is not listed in ensureOnlyKeys: '${keyName}'.\n` +
          'You can only use keys listed in `ensureOnlyKeys`:\n' +
          ensureOnlyKeys.map(k => `  - ${k}`).join('\n'))
      }
      if (removeKeys.length > 0 && keepKeys.length > 0) {
        throw $property.buildCodeFrameError(`\n${debugName}: You cannot specify both 'removeKeys' and 'keepKeys'`)
      }
      if (
        (removeKeys.length > 0 && removeKeys.includes(keyName)) ||
        (keepKeys.length > 0 && !keepKeys.includes(keyName))
      ) {
        onRemoveKey?.(keyName)
        $property.remove()
      }
    }
  }
}

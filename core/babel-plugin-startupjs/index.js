const { readFileSync } = require('fs')
const { join } = require('path')

const MAGIC_MODULE_NAME = '@startupjs/ui'

module.exports = function ({ template, types: t }) {
  const buildImport = template('import %%name%% from %%source%%')
  const buildExport = template('export { default as %%name%% } from %%source%%')

  return {
    name: 'Unwrap imports for tree shaking.',
    visitor: {
      ImportDeclaration ($this) {
        if ($this.get('source').node.value !== MAGIC_MODULE_NAME) return
        let transformed = false // needed to prevent infinite loops
        const theImports = $this.get('specifiers')
          .map($specifier => {
            // pluck out into a separate import
            if ($specifier.isImportSpecifier()) {
              transformed = true
              const originalName = $specifier.get('imported').node.name
              if (!checkNamedExportExists(originalName)) {
                throw $specifier.buildCodeFrameError(
                  `Named export "${originalName}" does not exist in "${MAGIC_MODULE_NAME}" "exports" field in package.json`
                )
              }
              const importedName = $specifier.get('local').node.name
              return buildImport({
                name: importedName,
                source: `${MAGIC_MODULE_NAME}/${originalName}`
              })
            }
            // pass as is
            return t.importDeclaration([$specifier.node], t.stringLiteral(MAGIC_MODULE_NAME))
          })
        if (!transformed) return
        $this.replaceWithMultiple(theImports)
      },
      ExportNamedDeclaration ($this) {
        if ($this.get('source').node.value !== MAGIC_MODULE_NAME) return
        const theExports = $this.get('specifiers')
          .map($specifier => {
            const originalName = $specifier.get('local').node.name
            if (!checkNamedExportExists(originalName)) {
              throw $specifier.buildCodeFrameError(
                `Named export "${originalName}" does not exist in "${MAGIC_MODULE_NAME}" "exports" field in package.json`
              )
            }
            const exportedName = $specifier.get('exported').node.name
            return buildExport({
              name: exportedName,
              source: `${MAGIC_MODULE_NAME}/${originalName}`
            })
          })

        $this.replaceWithMultiple(theExports)
      }
    }
  }
}

let namedExports
function checkNamedExportExists (name) {
  try {
    if (!namedExports) {
      const packageJsonPath = join(require.resolve(MAGIC_MODULE_NAME), '../package.json')
      namedExports = JSON.parse(readFileSync(packageJsonPath, 'utf8')).exports
    }
    return !!namedExports['./' + name]
  } catch {
    return false
  }
}

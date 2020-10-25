const moduleMap = require('./moduleMap.json')

function getDistLocation (moduleName, importName) {
  if (!(moduleMap[moduleName] && moduleMap[moduleName][importName])) {
    console.warn('>>>>>>\n>>>>>\n>>>>>>\n>>>>>> NO MODULE FOUND', moduleName, importName)
    return
  }
  return moduleName + moduleMap[moduleName][importName]
}

const canProcess = ({ source, specifiers }) =>
  source && moduleMap[source.value] && specifiers.length

module.exports = function ({ types: t }) {
  return {
    name: 'Unwrap imports for tree shaking.',
    visitor: {
      ImportDeclaration (path, state) {
        const { specifiers } = path.node
        if (canProcess(path.node)) {
          const moduleName = path.node.source.value
          const transformed = specifiers
            .map(specifier => {
              if (t.isImportSpecifier(specifier)) {
                const importName = specifier.imported.name
                const distLocation = getDistLocation(moduleName, importName)

                if (distLocation) {
                  return t.importDeclaration(
                    [t.importDefaultSpecifier(t.identifier(specifier.local.name))],
                    t.stringLiteral(distLocation)
                  )
                }
              }
              return t.importDeclaration(
                [specifier],
                t.stringLiteral(moduleName + '/index')
              )
            })
            .filter(Boolean)

          path.replaceWithMultiple(transformed)
        }
      },
      ExportNamedDeclaration (path, state) {
        const { specifiers } = path.node
        if (canProcess(path.node)) {
          const moduleName = path.node.source.value
          const transformed = specifiers
            .map(specifier => {
              if (t.isExportSpecifier(specifier)) {
                const exportName = specifier.exported.name
                const localName = specifier.local.name
                const distLocation = getDistLocation(moduleName, localName)

                if (distLocation) {
                  return t.exportNamedDeclaration(
                    null,
                    [t.exportSpecifier(t.identifier('default'), t.identifier(exportName))],
                    t.stringLiteral(distLocation)
                  )
                }
              }
              return t.exportNamedDeclaration(
                null,
                [specifier],
                t.stringLiteral(moduleName + '/index')
              )
            })
            .filter(Boolean)

          path.replaceWithMultiple(transformed)
        }
      }
    }
  }
}

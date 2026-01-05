const { readFileSync } = require('fs')
const { join } = require('path')

const MAGIC_MODULE_NAME = 'startupjs-ui'

module.exports = function ({ template, types: t }, { asyncImports = false } = {}) {
  const buildImport = template('import %%name%% from %%source%%')
  const buildExport = template('export { default as %%name%% } from %%source%%')
  // when asyncImports is enabled, we replace imports with dynamic imports:
  // import { Button, Card } from 'startupjs-ui'
  // -->
  // const [Button, Card] = await Promise.all([
  //   import('startupjs-ui/Button').then(m => m.default),
  //   import('startupjs-ui/Card').then(m => m.default)
  // ])
  // Note that this currently does not work in Expo because React Native
  // does not support top-level await yet.
  const buildAsyncImport = source => {
    const importCall = t.callExpression(t.import(), [t.stringLiteral(source)])
    return t.callExpression(
      t.memberExpression(importCall, t.identifier('then')),
      [t.arrowFunctionExpression(
        [t.identifier('m')],
        t.memberExpression(t.identifier('m'), t.identifier('default'))
      )]
    )
  }
  const buildPromiseAll = (names, imports) => t.variableDeclaration('const', [
    t.variableDeclarator(
      t.arrayPattern(names),
      t.awaitExpression(
        t.callExpression(
          t.memberExpression(t.identifier('Promise'), t.identifier('all')),
          [t.arrayExpression(imports)]
        )
      )
    )
  ])

  return {
    name: 'Unwrap imports for tree shaking.',
    visitor: {
      Program ($this) {
        let executed = false
        const asyncImportNames = []
        const asyncImportExpressions = []
        const asyncExportSpecifiers = []
        $this.traverse({
          ImportDeclaration ($path) {
            if ($path.get('source').node.value !== MAGIC_MODULE_NAME) return
            let transformed = false // needed to prevent infinite loops
            const theImports = []
            $path.get('specifiers').forEach($specifier => {
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
                if (asyncImports) {
                  asyncImportNames.push(t.identifier(importedName))
                  asyncImportExpressions.push(buildAsyncImport(`${MAGIC_MODULE_NAME}/${originalName}`))
                } else {
                  theImports.push(buildImport({
                    name: importedName,
                    source: `${MAGIC_MODULE_NAME}/${originalName}`
                  }))
                }
                return
              }
              // pass as is
              theImports.push(t.importDeclaration([$specifier.node], t.stringLiteral(MAGIC_MODULE_NAME)))
            })
            if (!transformed) return
            if (asyncImports) {
              if (theImports.length > 0) {
                $path.replaceWithMultiple(theImports)
              } else {
                $path.remove()
              }
            } else {
              $path.replaceWithMultiple(theImports)
            }
            executed = true
          },
          ExportNamedDeclaration ($path) {
            if ($path.get('source')?.node?.value !== MAGIC_MODULE_NAME) return
            const specifiers = $path.get('specifiers')
            if (asyncImports) {
              specifiers.forEach($specifier => {
                const originalName = $specifier.get('local').node.name
                if (!checkNamedExportExists(originalName)) {
                  throw $specifier.buildCodeFrameError(
                    `Named export "${originalName}" does not exist in "${MAGIC_MODULE_NAME}" "exports" field in package.json`
                  )
                }
                const exportedName = $specifier.get('exported').node.name
                const localId = t.identifier(exportedName)
                asyncImportNames.push(localId)
                asyncImportExpressions.push(buildAsyncImport(`${MAGIC_MODULE_NAME}/${originalName}`))
                asyncExportSpecifiers.push(t.exportSpecifier(localId, t.identifier(exportedName)))
              })
              if (specifiers.length > 0) {
                $path.remove()
                executed = true
              }
              return
            }
            const theExports = specifiers.map($specifier => {
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
            $path.replaceWithMultiple(theExports)
            executed = true
          }
        })
        if (asyncImports && asyncImportNames.length > 0) {
          const promiseAll = buildPromiseAll(asyncImportNames, asyncImportExpressions)
          const bodyPaths = $this.get('body')
          let lastImportPath
          bodyPaths.forEach($path => {
            if ($path.isImportDeclaration()) lastImportPath = $path
          })
          let promiseAllPath
          if (lastImportPath) {
            promiseAllPath = lastImportPath.insertAfter(promiseAll)[0]
          } else {
            $this.unshiftContainer('body', promiseAll)
            promiseAllPath = $this.get('body.0')
          }
          if (asyncExportSpecifiers.length > 0) {
            const exportDeclaration = t.exportNamedDeclaration(null, asyncExportSpecifiers)
            if (promiseAllPath) {
              promiseAllPath.insertAfter(exportDeclaration)
            } else {
              $this.pushContainer('body', exportDeclaration)
            }
          }
          executed = true
        }
        // re-crawl to update scope bindings
        if (executed) $this.scope.crawl()
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

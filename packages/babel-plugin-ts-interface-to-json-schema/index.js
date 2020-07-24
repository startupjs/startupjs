const syntaxTypeScript = require('@babel/plugin-syntax-typescript').default
const t = require('@babel/types')
const babelParser = require('@babel/parser')
const generate = require('@babel/generator').default
const TJS = require('typescript-json-schema')
const fs = require('fs')
const os = require('os')
const path = require('path')
const uuid = require('uuid')

const IMPORT_ORM_REGEXP = /^@?startupjs\/orm$/

module.exports = function (babel) {
  return {
    inherits: syntaxTypeScript,

    visitor: {
      Program: {
        enter: (programPath) => {
          let ImportDeclarations = []
          let TSInterfaceDeclaration
          let ExportDefaultDeclaration

          programPath.node.body.forEach((node) => {
            if (t.isImportDeclaration(node)) {
              ImportDeclarations.push(node)
            }

            if (!TSInterfaceDeclaration && t.isTSInterfaceDeclaration(node)) {
              TSInterfaceDeclaration = node
            }

            if (!ExportDefaultDeclaration && t.isExportDefaultDeclaration(node)) {
              ExportDefaultDeclaration = node
            }
          })

          if (!ImportDeclarations.some((node) => IMPORT_ORM_REGEXP.test(node.source.extra.rawValue))) {
            return
          }

          let schema = {}

          if (TSInterfaceDeclaration) {
            const { code: interfaceCode } = generate(TSInterfaceDeclaration)

            const basePath = path.join(os.tmpdir(), uuid.v4())
            const interfaceFile = path.join(basePath, 'TSInterfaceDeclaration.ts')

            fs.mkdirSync(basePath, { recursive: true })

            fs.writeFileSync(interfaceFile, interfaceCode)

            const program = TJS.getProgramFromFiles([interfaceFile], {}, basePath)
            schema = TJS.generateSchema(program, TSInterfaceDeclaration.id.name)

            fs.unlinkSync(interfaceFile)
          }

          if (ExportDefaultDeclaration) {
            ExportDefaultDeclaration.declaration.body.body.unshift(
              t.classProperty(
                t.identifier('schema'),
                babelParser.parseExpression(JSON.stringify(schema, null, 2)),
                null,
                null,
                null,
                true
              )
            )
          }
        }
      }
    }
  }
}

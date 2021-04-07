const T_FUNCTION_NAME = 't'
const LIBRARY_NAME = 'startupjs'

module.exports = function (babel) {
  const t = babel.types
  let skip
  let tFunctionName

  return {
    pre () {
      skip = true
      tFunctionName = undefined
    },
    visitor: {
      ImportDeclaration: (path) => {
        const node = path.node
        if (node.source.value !== LIBRARY_NAME) return
        const { specifiers } = node
        for (const specifier of specifiers) {
          // console.log(specifier)
          if (specifier.imported.name !== T_FUNCTION_NAME) continue
          tFunctionName = specifier.local.name
          skip = false
        }
        // console.log(path, 'path')
      },
      CallExpression: (path) => {
        if (skip) return

        const node = path.node
        if (node.callee.name !== tFunctionName) return

        const args = node.arguments
        if (args.length < 2) {
          // TODO: add file name to error message
          throw new Error(
            '[@startupjs/babel-plugin-i18n-extract]: ' +
            `Not enough arguments passed to the function ${tFunctionName}`
          )
        }

        const keyNode = args[0]
        const defaultValueNode = args[1]

        if (!t.isStringLiteral(keyNode)) {
          throw new Error(
            '[@startupjs/babel-plugin-i18n-extract]: ' +
            `Argument 'key' of ${tFunctionName} should be a string literal`
          )
        }

        if (!keyNode.value) {
          throw new Error(
            '[@startupjs/babel-plugin-i18n-extract]: ' +
            `Argument 'key' of ${tFunctionName} cannot be an empty string`
          )
        }

        if (!t.isStringLiteral(defaultValueNode)) {
          throw new Error(
            '[@startupjs/babel-plugin-i18n-extract]: ' +
            `Argument 'defaultValue' of ${tFunctionName} should be a string literal`
          )
        }

        if (!defaultValueNode.value) {
          throw new Error(
            '[@startupjs/babel-plugin-i18n-extract]: ' +
            `Argument 'defaultValue' of ${tFunctionName} cannot be an empty string`
          )
        }
      }
    }
  }
}

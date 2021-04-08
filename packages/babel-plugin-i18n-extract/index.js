const T_FUNCTION_NAME = 't'
const LIBRARY_NAME = 'startupjs'

module.exports = function (babel) {
  const t = babel.types
  let skip
  let tFunctionName
  let $program

  return {
    pre () {
      skip = true
      tFunctionName = undefined
      $program = undefined
    },
    visitor: {
      Program: ($this) => {
        $program = $this
      },
      ImportDeclaration: ($this) => {
        if ($this.node.source.value !== LIBRARY_NAME) return
        for (const specifier of $this.node.specifiers) {
          if (specifier.imported.name !== T_FUNCTION_NAME) continue
          tFunctionName = specifier.local.name
          skip = false
        }
      },
      CallExpression: ($this, state) => {
        if (skip) return

        const tFunctionBinding = $this.scope.getBinding(tFunctionName)
        const programTFunctionBinding = $program.scope.bindings[tFunctionName]

        if (tFunctionBinding !== programTFunctionBinding) return
        if ($this.node.callee.name !== tFunctionName) return

        const args = $this.node.arguments

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

        console.log($this)
        // content = fs.readFileSync(filePath, { encoding: 'utf8' });
        // fs.writeFileSync(
        //   filePath,
        //   exporter.stringify({
        //     config,
        //     file: translationFile,
        //   }),
        //   {
        //     encoding: 'utf8',
        //   },
        // );
        // keyNode.value
      }
    }
  }
}

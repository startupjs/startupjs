const fs = require('fs')
const path = require('path')
const packageJson = require('./package.json')
const moduleLocation = require.resolve(packageJson.name)

const T_FUNCTION_NAME = 't'
const LIBRARY_NAME = 'startupjs'
const FILENAME = 'translations.json'

module.exports = function (babel, opts) {
  const t = babel.types
  let skip
  let tFunctionName
  let $program
  let keys

  return {
    pre () {
      skip = true
      tFunctionName = undefined
      $program = undefined
      keys = {}
    },
    post (state) {
      let { cwd, filename } = state.opts
      const isTestEnv = process.env.NODE_ENV === 'test'

      // workaround for tests
      if (!filename && isTestEnv) {
        filename = this.opts.filename
      }

      if (!filename) return

      const key = filename
        // HACK
        // for linked packages in node_modules the state.opts.filename return
        // linked path instead of path to node_modules
        // we need this path to be correct to replace cwd
        .replace('startupjs/packages', 'styleguide/node_modules')
        .replace(cwd, '')

      let fileContent
      const filePath = path.join(path.dirname(moduleLocation), FILENAME)

      try {
        fileContent = JSON.parse(
          fs.readFileSync(filePath, { encoding: 'utf8' })
        )
      } catch (err) {
        fileContent = {}
      }

      if (!Object.keys(keys).length) {
        if (fileContent[key]) delete fileContent[key]
        return
      }

      fileContent[key] = keys

      fs.writeFileSync(
        filePath,
        JSON.stringify(fileContent),
        { encoding: 'utf8' }
      )
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
      CallExpression: ($this) => {
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

        if (!t.isStringLiteral(defaultValueNode)) {
          throw new Error(
            '[@startupjs/babel-plugin-i18n-extract]: ' +
            `Argument 'defaultValue' of ${tFunctionName} should be a string literal`
          )
        }

        const key = keyNode.value
        const defaultValue = defaultValueNode.value

        if (!key) {
          throw new Error(
            '[@startupjs/babel-plugin-i18n-extract]: ' +
            `Argument 'key' of ${tFunctionName} cannot be an empty string`
          )
        }

        if (!defaultValue) {
          throw new Error(
            '[@startupjs/babel-plugin-i18n-extract]: ' +
            `Argument 'defaultValue' of ${tFunctionName} cannot be an empty string`
          )
        }

        keys[key] = defaultValue
      }
    }
  }
}

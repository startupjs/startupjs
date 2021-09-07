const fs = require('fs')
const path = require('path')
const packageJson = require('./package.json')
const moduleLocation = require.resolve(packageJson.name)

const T_FUNCTION_NAME = 't'
const IMPORT_T_FUNCTION_LIBRARIES = [
  'startupjs',
  'startupjs/i18n',
  '@startupjs/i18n'
]
const FILENAME = 'translations.json'

module.exports = function (babel, opts) {
  const t = babel.types
  let skip
  let tFunctionName
  let $program
  let keys = {}
  let processedFilename
  let pluginOptions

  return {
    pre (state) {
      skip = true
      tFunctionName = undefined
      $program = undefined
      keys = {}
      processedFilename = undefined
      pluginOptions = this.opts
    },
    post (state) {
      if (skip) return

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
        if (fileContent[processedFilename]) delete fileContent[processedFilename]
        return
      }

      fileContent[processedFilename] = keys

      fs.writeFileSync(
        filePath,
        JSON.stringify(fileContent),
        { encoding: 'utf8' }
      )
    },
    visitor: {
      Program: ($this, state) => {
        $program = $this
      },
      ImportDeclaration: ($this, state) => {
        let fnName
        const value = $this.node.source.value
        const hasImport = IMPORT_T_FUNCTION_LIBRARIES.includes(value)

        if (!hasImport) return

        for (const specifier of $this.node.specifiers) {
          if (specifier.imported.name !== T_FUNCTION_NAME) continue
          fnName = specifier.local.name
        }

        if (!fnName) return

        tFunctionName = fnName
        skip = false

        let { cwd, filename } = state
        const isTestEnv = process.env.NODE_ENV === 'test'
        // workaround for tests
        if (!filename && isTestEnv) {
          filename = pluginOptions?.filename
        }

        // workaround for tests
        if (!filename) return

        filename = filename
          // HACK
          // for linked packages in node_modules the state.opts.filename return
          // linked path instead of path to node_modules
          // we need this path to be correct to replace cwd
          .replace('startupjs/packages', 'styleguide/node_modules')
          .replace(cwd, '')

        processedFilename = encode(filename)
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

        if (!keyNode.value.indexOf(processedFilename)) return

        keyNode.value = `${processedFilename}.${encode(keyNode.value)}`
        keys[key] = defaultValue
      }
    }
  }
}

function encode (str) {
  return str.replace(/\./g, '%2E')
}

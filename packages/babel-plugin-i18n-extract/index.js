const fs = require('fs')
const path = require('path')
const merge = require('lodash/merge')
const packageJson = require('./package.json')
const moduleLocation = require.resolve(packageJson.name)

const T_FUNCTION_NAME = 't'
const IMPORT_T_FUNCTION_LIBRARIES = [
  'startupjs',
  'startupjs/i18n',
  '@startupjs/i18n'
]
const TRANSLATIONS_FILENAME = 'translations.json'
const TRANSLATIONS_FILE_PATH = path.join(path.dirname(moduleLocation), TRANSLATIONS_FILENAME)
const COMMON_EXTENSION = /(\.[cm]?[tj]sx?)$/
const WEB_EXTENSION_REGEXP = /\.web(\.[cm]?[tj]sx?)$/
const COMMON_OR_WEB_EXTENSION_REGEXP = /(\.web|(?<!\..*))(\.[cm]?[tj]sx?)$/
const EXTENSIONS_REGEXP = /\.(?:web|android|ios)(\.[cm]?[tj]sx?)$/

module.exports = function (babel, opts) {
  const t = babel.types
  const { collectTranslations } = opts

  let isJsFile
  let tFunctionName
  let $program
  let translations = {}
  let filePathRoot
  let translationsKey
  let pluginOptions

  return {
    pre (state) {
      isJsFile = false
      tFunctionName = undefined
      $program = undefined
      translations = {}
      filePathRoot = undefined
      translationsKey = undefined
      pluginOptions = this.opts
    },
    post (state) {
      if (!isJsFile) return
      if (!collectTranslations) return

      let commonTranslationsKey
      const transformedFilePaths = []

      if (COMMON_OR_WEB_EXTENSION_REGEXP.test(filePathRoot)) {
        let re
        const isWebFile = WEB_EXTENSION_REGEXP.test(filePathRoot)
        let extensions = []

        if (isWebFile) {
          re = WEB_EXTENSION_REGEXP
          commonTranslationsKey = filePathRoot.replace(WEB_EXTENSION_REGEXP, '$1')
          transformedFilePaths.push(filePathRoot)
          if (fs.existsSync(commonTranslationsKey)) {
            babel.transformFileSync(commonTranslationsKey)
          } else {
            extensions = ['android', 'ios']
          }
        } else {
          re = COMMON_EXTENSION
          extensions = ['android', 'ios']
          commonTranslationsKey = filePathRoot
        }

        for (const extension of extensions) {
          const filePath = filePathRoot.replace(re, `${extension}$1`)
          if (!fs.existsSync(filePath)) continue
          transformedFilePaths.push(filePath)
          babel.transformFileSync(filePath)
        }
      }

      let fileContent
      let needToMergeFiles = commonTranslationsKey && transformedFilePaths.length

      try {
        fileContent = JSON.parse(
          fs.readFileSync(TRANSLATIONS_FILE_PATH, { encoding: 'utf8' })
        )
      } catch (err) {
        fileContent = {}
      }

      const encodedTranslationsKey = encode(translationsKey)

      fileContent[encodedTranslationsKey] = translations

      if (needToMergeFiles) {
        const cwd = state.opts.cwd
        commonTranslationsKey = encode(
          commonTranslationsKey
            .replace(cwd, '')
        )
        const keys = fileContent[commonTranslationsKey]
        const withKeys = []

        for (let filePath of transformedFilePaths) {
          filePath = encode(filePath.replace(cwd, ''))
          withKeys.push(fileContent[filePath])
          delete fileContent[filePath]
        }

        fileContent[commonTranslationsKey] = merge({}, keys, ...withKeys)
      }

      fs.writeFileSync(
        TRANSLATIONS_FILE_PATH,
        JSON.stringify(fileContent),
        { encoding: 'utf8' }
      )
    },
    visitor: {
      Program: ($this, state) => {
        $program = $this

        let { cwd, filename } = state
        const isTestEnv = process.env.NODE_ENV === 'test'
        // workaround for tests
        if (!filename && isTestEnv) {
          filename = pluginOptions?.filename
        }

        // workaround for tests
        if (!filename) return

        isJsFile = COMMON_EXTENSION.test(filename)
        filePathRoot = filename
          // HACK
          // for linked packages in node_modules the state.opts.filename return
          // linked path instead of path to node_modules
          // we need this path to be correct to replace cwd
          .replace('startupjs/packages', 'styleguide/node_modules')

        translationsKey = filename.replace(cwd, '')
      },
      ImportDeclaration: ($this, state) => {
        const value = $this.node.source.value

        if (!IMPORT_T_FUNCTION_LIBRARIES.includes(value)) return

        for (const specifier of $this.node.specifiers) {
          if (specifier.imported.name !== T_FUNCTION_NAME) continue
          tFunctionName = specifier.local.name
          break
        }
      },
      CallExpression: ($this, state) => {
        if (!tFunctionName) return

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

        const encodedTranslationsKey = encode(
          translationsKey.replace(EXTENSIONS_REGEXP, '$1')
        )

        if (!keyNode.value.indexOf(encodedTranslationsKey)) return

        keyNode.value = `${encodedTranslationsKey}.${encode(keyNode.value)}`
        translations[key] = defaultValue
      }
    }
  }
}

function encode (str) {
  return str.replace(/\./g, '%2E')
}

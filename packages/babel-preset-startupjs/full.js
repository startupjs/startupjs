// TODO: experiment with trying to combine all startupjs-related babel plugins into one preset
// NOTE: this is used by ./full.js
// Following is an experiment for combining all startupjs-related babel plugins into one preset
// and running it all together in one babel transform.
// The 'babel-preset-startupjs/full' preset also does check for the magic libraries within
// babel itself through the skippablePreset.js hack.
// Drawbacks of this approach:
//   it still requires running transformation separately from the underlying expo/metro babel transform
//   and just putting this preset into babel config doesn't work.

const skippablePreset = require('./skippablePreset.js')

const PLUGIN_KEYS = ['name', 'for']
const ALL_ENVS = ['client', 'isomorphic', 'server', 'build']
const MAGIC_IMPORTS = ['startupjs/registry', '@startupjs/registry']

const MULTI_ENV_FILES_REGEX = /(?:[./]plugin\.[mc]?[jt]sx?|startupjs\.config\.[mc]?[jt]sx?)$/
const STARTUPJS_CODE_REGEX = /['"]@?startupjs(?:\/registry)?['"]/
const EXCLUDED_LIBS_REGEX = /\/node_modules\/(?:expo-[^/]+|@expo|react-native)\//

const isMultiEnvFile = filename => commonTest(filename) && MULTI_ENV_FILES_REGEX.test(filename)
const isStartupjsCode = code => STARTUPJS_CODE_REGEX.test(code)
const commonTest = filename => !EXCLUDED_LIBS_REGEX.test(filename)

module.exports = skippablePreset(isStartupjsCode, (api, {
  platform = 'web',
  env = 'development',
  envs = ['client', 'isomorphic']
} = {}) => {
  return {
    comments: false,
    compact: true,
    overrides: [{
      test: isTypeScriptSource,
      plugins: [
        [require('@babel/plugin-syntax-typescript'), { isTSX: false }]
      ]
    }, {
      test: isTSXSource,
      plugins: [
        [require('@babel/plugin-syntax-typescript'), { isTSX: true }]
      ]
    }, {
      test: isJSXSource,
      plugins: [
        // support JSX syntax
        require('@babel/plugin-syntax-jsx'),
        require('@babel/plugin-syntax-flow')
      ]
    }, {
      test: commonTest,
      plugins: [
        // transform pug to jsx. This generates a bunch of new AST nodes
        // (it's important to do this first before any dead code elimination runs)
        [require('babel-plugin-transform-react-pug'), {
          classAttribute: 'styleName'
        }],
        // support calling sub-components in pug (like <Modal.Header />)
        [require('@startupjs/babel-plugin-react-pug-classnames'), {
          classAttribute: 'styleName'
        }]
      ]
    }, {
      test: isMultiEnvFile,
      plugins: [
        // traverse "exports" of package.json and all dependencies to find all startupjs plugins
        // and automatically import them in the main startupjs.config.js file
        require('@startupjs/babel-plugin-startupjs-plugins')
      ]
    }, {
      test: isMultiEnvFile,
      plugins: [
        // run eliminator to remove code targeting other envs.
        // For example, only keep code related to 'client' and 'isomorphic' envs
        // (in which case any code related to 'server' and 'build' envs will be removed)
        [require('@startupjs/babel-plugin-eliminator'), {
          keepObjectKeysOfFunction: {
            createProject: {
              magicImports: MAGIC_IMPORTS,
              targetObjectJsonPath: '$.plugins.*',
              ensureOnlyKeys: ALL_ENVS,
              keepKeys: envs
            },
            createPlugin: {
              magicImports: MAGIC_IMPORTS,
              ensureOnlyKeys: [...PLUGIN_KEYS, ...ALL_ENVS],
              keepKeys: [...PLUGIN_KEYS, ...envs]
            }
          }
        }]
      ]
    }, {
      test: commonTest,
      plugins: [
        // turning on experimental startupjs features
        [require('@startupjs/babel-plugin-startupjs-utils'), {
          observerCache: true,
          signals: true
        }],
        // debugging features
        env === 'development' && require('@startupjs/babel-plugin-startupjs-debug'),
        // .env files support for client
        [require('@startupjs/babel-plugin-dotenv'), (() => {
          const envName = env === 'production' ? 'production' : 'local'
          const options = {
            moduleName: '@env',
            path: ['.env', `.env.${envName}`]
          }
          if (platform === 'web') {
            options.override = {
              BASE_URL: "typeof window !== 'undefined' && window.location && window.location.origin"
            }
          }
          return options
        })()],
        // CSS modules (separate .styl/.css file)
        [require('@startupjs/babel-plugin-rn-stylename-to-style'), {
          extensions: ['styl', 'css'],
          useImport: true
        }],
        // inline CSS modules (styl`` in the same JSX file -- similar to how it is in Vue.js)
        [require('@startupjs/babel-plugin-rn-stylename-inline'), {
          platform
        }],
        require('@startupjs/babel-plugin-i18n-extract')
      ].filter(Boolean)
    }]
  }
})

function isTypeScriptSource (fileName) {
  return !!fileName && fileName.endsWith('.ts')
}

function isTSXSource (fileName) {
  return !!fileName && fileName.endsWith('.tsx')
}

function isJSXSource (fileName) {
  return !isTypeScriptSource(fileName) && !isTSXSource(fileName)
}

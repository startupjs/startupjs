const { CONFIG_FILENAME_REGEX } = require('./utils.js')

const PLUGIN_KEYS = ['name', 'for', 'order', 'enabled']
const PROJECT_KEYS = ['plugins', 'modules']
const ALL_ENVS = ['features', 'isomorphic', 'client', 'server', 'build']
const MAGIC_IMPORTS = ['startupjs/registry', '@startupjs/registry']

module.exports = (api, {
  transformPug = true,
  useRequireContext,
  envs = ['features', 'isomorphic', 'server']
} = {}) => {
  return {
    overrides: [{
      test: isJsxSource,
      plugins: [
        require('@babel/plugin-syntax-jsx')
      ]
    }, {
      test: isTypeScriptSource,
      plugins: [
        require('@babel/plugin-syntax-typescript')
      ]
    }, {
      test: isTsxSource,
      plugins: [
        [require('@babel/plugin-syntax-typescript'), {
          isTSX: true
        }]
      ]
    }, {
      plugins: [
        transformPug && [require('cssxjs/babel/plugin-react-pug'), {
          classAttribute: 'styleName'
        }],

        // auto-load startupjs plugins
        // traverse "exports" of package.json and all dependencies to find all startupjs plugins
        // and automatically import them in the main startupjs.config.js file
        [require('@startupjs/babel-plugin-startupjs-plugins'), { useRequireContext }],
        [require('teamplay/babel'), {
          useRequireContext: false,
          fallbackModelsFolders: ['model'],
          autoInit: false,
          clientOnly: false
        }],

        // run eliminator to remove code targeting other envs.
        // For example, only keep code related to 'server' and 'isomorphic' envs
        // (in which case any code related to 'client' and 'build' envs will be removed)
        [require('@startupjs/babel-plugin-eliminator'), {
          trimObjects: [{
            magicFilenameRegex: CONFIG_FILENAME_REGEX,
            magicExport: 'default',
            targetObjectJsonPath: '$.modules.*',
            ensureOnlyKeys: ALL_ENVS,
            keepKeys: envs
          }, {
            magicFilenameRegex: CONFIG_FILENAME_REGEX,
            magicExport: 'default',
            targetObjectJsonPath: '$.plugins.*',
            ensureOnlyKeys: ALL_ENVS,
            keepKeys: envs
          }, {
            magicFilenameRegex: CONFIG_FILENAME_REGEX,
            magicExport: 'default',
            targetObjectJsonPath: '$',
            // envs on the top level are the alias for '$.modules.startupjs'
            ensureOnlyKeys: [...PROJECT_KEYS, ...ALL_ENVS],
            keepKeys: [...PROJECT_KEYS, ...envs]
          }, {
            functionName: 'createPlugin',
            magicImports: MAGIC_IMPORTS,
            ensureOnlyKeys: [...PLUGIN_KEYS, ...ALL_ENVS],
            keepKeys: [...PLUGIN_KEYS, ...envs]
          }]
        }]
      ].filter(Boolean)
    }]
  }
}

// all files which are not .ts or .tsx are considered to be pure JS with JSX support
function isJsxSource (fileName) {
  if (!fileName) return false
  return !isTypeScriptSource(fileName) && !isTsxSource(fileName)
}

function isTypeScriptSource (fileName) {
  if (!fileName) return false
  return fileName.endsWith('.ts')
}

// NOTE: .tsx is the default when fileName is not provided.
//       This is because we want to support the most overarching syntax by default.
function isTsxSource (fileName) {
  if (!fileName) return true
  return fileName.endsWith('.tsx')
}

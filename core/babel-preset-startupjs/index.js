/**
 * Compilation pipeline:
 * 1. Transform pug to jsx
 * 2. Auto-load startupjs plugins
 * 3. Run eliminator to remove code targeting other envs
 * 4. Transform CSS modules
 *
 * Options:
 *   platform - Force platform to compile to (e.g. 'ios', 'android', 'web').
 *       Default: 'web' (or auto-detected on React Native)
 *       On React Native (Metro) this gets automatically detected inside babel plugins.
 *   reactType - Force the React type - RN or pure web React (e.g. 'react-native', 'web').
 *       Default: undefined (auto-detected)
 *       This shouldn't be needed in most cases since it will be automatically detected.
 *   cache - Force the CSS caching library instance (e.g. 'teamplay').
 *       Default: undefined (auto-detected)
 *       This shouldn't be needed in most cases since it will be automatically detected.
 *   transformPug - Whether to transform pug to jsx.
 *       Default: true
 *   transformCss - Whether to transform CSS modules (styl/css files and styl`` css`` in JSX).
 *       Default: true
 *   useRequireContext - Whether to use require.context for loading startupjs plugins.
 *       The underlying environment must support require.context (e.g. Metro, Webpack).
 *       Default: true
 *   clientOnly - Whether to transform model/*.js files to keep only the client-relevant code.
 *       Default: true
 *       This option is required when building for the client (React Native or web) so that
 *       server-only code is removed from model files and secret information is not leaked to the client.
 *   envs - Array of envs to keep during code elimination of the startupjs config and plugins.
 *       Default: ['features', 'isomorphic', 'client']
 *       On the server, this should usually include 'server' instead of 'client':
 *       ['features', 'isomorphic', 'server']
 *   isStartupjsFile - A function (filename, code) => boolean that checks whether the given file
 *       is part of the startupjs ecosystem (a plugin, startupjs.config.js, loadStartupjsConfig.js or a model file).
 *       Default: a function that returns true for all startupjs plugin ecosystem files. And also
 *       when clientOnly is true, it also returns true for model/*.js files to keep only client-relevant code there.
 *   docgen - Whether to enable docgen features - magic exports of JSON schemas from TypeScript interfaces.
 *       Default: false
 */
const { createStartupjsFileChecker, CONFIG_FILENAME_REGEX } = require('./utils.js')
const PLUGIN_KEYS = ['name', 'for', 'order', 'enabled']
const PROJECT_KEYS = ['plugins', 'modules']
const ALL_ENVS = ['features', 'isomorphic', 'client', 'server', 'build']
const MAGIC_IMPORTS = ['startupjs/registry', '@startupjs/registry']

module.exports = (api, {
  platform,
  reactType,
  cache,
  compileCssImports,
  cssFileExtensions,
  transformCss = true,
  transformPug = true,
  useRequireContext = true,
  clientOnly = true,
  envs = ['features', 'isomorphic', 'client'],
  isStartupjsFile = createStartupjsFileChecker({ clientOnly }),
  docgen = false
} = {}) => {
  const isMetro = api.caller(caller => caller?.name === 'metro')

  // By default on Metro we don't need to compile CSS imports since we are relying on the custom
  // StartupJS metro-babel-transformer which handles CSS imports as separate files.
  if (compileCssImports == null && isMetro) compileCssImports = false

  // on Metro we transform any CSS imports since StartupJS metro-babel-transformer
  // turns off Expo's default CSS support and handles only our CSS imports.
  // When used in a plain Web project though though,
  // we want to only handle the default ['cssx.css', 'cssx.styl'] extensions.
  if (cssFileExtensions == null && isMetro) cssFileExtensions = ['styl', 'css']

  return {
    overrides: [{
      test: isJsxSource,
      plugins: [
        // support JSX syntax
        require('@babel/plugin-syntax-jsx')
      ]
    }, {
      test: isTypeScriptSource,
      plugins: [
        // support TypeScript syntax
        require('@babel/plugin-syntax-typescript')
      ]
    }, {
      test: isTsxSource,
      plugins: [
        // support TypeScript + JSX syntax
        [require('@babel/plugin-syntax-typescript'), {
          isTSX: true
        }]
      ]
    }, {
      plugins: [
        docgen && [require('@startupjs/babel-plugin-ts-to-json-schema'), {
          magicExportName: '_PropsJsonSchema',
          interfaceMatch: 'export interface'
        }],

        // transform pug to jsx. This generates a bunch of new AST nodes
        // (it's important to do this first before any dead code elimination runs)
        transformPug && [require('cssxjs/babel/plugin-react-pug'), { classAttribute: 'styleName' }],

        // inline CSS modules (styl`` in the same JSX file -- similar to how it is in Vue.js)
        transformCss && [require('cssxjs/babel/plugin-rn-stylename-inline'), {
          platform
        }],
        // CSS modules (separate .styl/.css file)
        transformCss && [require('cssxjs/babel/plugin-rn-stylename-to-style'), {
          extensions: cssFileExtensions,
          useImport: true,
          reactType,
          cache,
          compileCssImports
        }],

        // auto-load startupjs plugins
        // traverse "exports" of package.json and all dependencies to find all startupjs plugins
        // and automatically import them in the main startupjs.config.js file
        [require('@startupjs/babel-plugin-startupjs-plugins'), { useRequireContext }],

        // run eliminator to remove code targeting other envs.
        // For example, only keep code related to 'client' and 'isomorphic' envs
        // (in which case any code related to 'server' and 'build' envs will be removed)
        [require('@startupjs/babel-plugin-eliminator'), {
          shouldTransformFileChecker: isStartupjsFile,
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
          }],
          ...(clientOnly
            ? {
                transformFunctionCalls: [{
                  // direct named exports of aggregation() within model/*.js files
                  // are replaced with aggregationHeader() calls.
                  // 'collection' is the filename without extension
                  // 'name' is the direct named export const name
                  //
                  // Example:
                  //
                  //   // in model/games.js
                  //   export const $$byGameId = aggregation(({ gameId }) => ({ gameId }))
                  //
                  // will be replaced with:
                  //
                  //   __aggregationHeader({ collection: 'games', name: '$$byGameId' })
                  //
                  functionName: 'aggregation',
                  magicImports: ['startupjs'],
                  requirements: {
                    argumentsAmount: 1,
                    directNamedExportedAsConst: true
                  },
                  replaceWith: {
                    newFunctionNameFromSameImport: '__aggregationHeader',
                    newCallArgumentsTemplate: `[
                      {
                        collection: %%filenameWithoutExtension%%,
                        name: %%directNamedExportConstName%%
                      }
                    ]`
                  }
                }, {
                  // export default inside of aggregation() within a separate model/*.$$myAggregation.js files
                  // are replaced with aggregationHeader() calls.
                  // Filepath is stripped of the extensions and split into sections (by dots and slashes)
                  // 'name' is the last section.
                  // 'collection' is the section before it.
                  //
                  // Example:
                  //
                  //   // in model/games/$$active.js
                  //   export default aggregation(({ gameId }) => ({ gameId }))
                  //
                  // will be replaced with:
                  //
                  //   __aggregationHeader({ collection: 'games', name: '$$active' })
                  //
                  functionName: 'aggregation',
                  magicImports: ['startupjs'],
                  requirements: {
                    argumentsAmount: 1,
                    directDefaultExported: true
                  },
                  replaceWith: {
                    newFunctionNameFromSameImport: '__aggregationHeader',
                    newCallArgumentsTemplate: `[
                      {
                        collection: %%folderAndFilenameWithoutExtension%%.split(/[\\\\/\\.]/).at(-2),
                        name: %%folderAndFilenameWithoutExtension%%.split(/[\\\\/\\.]/).at(-1)
                      }
                    ]`
                  }
                }, {
                  // TODO: this has to be implemented! It's not actually working yet.

                  // any other calls to aggregation() must explicitly define the collection and name
                  // as the second argument. If not, the build will fail.
                  //
                  // Example:
                  //
                  //   aggregation(
                  //     ({ gameId }) => ({ gameId }),
                  //     { collection: 'games', name: 'byGameId' }
                  //   )
                  //
                  // will be replaced with:
                  //
                  //   __aggregationHeader({ collection: 'games', name: 'byGameId' })
                  //
                  functionName: 'aggregation',
                  magicImports: ['startupjs'],
                  requirements: {
                    argumentsAmount: 2
                  },
                  throwIfRequirementsNotMet: true,
                  replaceWith: {
                    newFunctionNameFromSameImport: '__aggregationHeader',
                    newCallArgumentsTemplate: '[%%argument1%%]' // 0-based index
                  }
                }, {
                  // remove accessControl() calls (replace with undefined)
                  functionName: 'accessControl',
                  magicImports: ['startupjs'],
                  replaceWith: {
                    remove: true // replace the whole function call with undefined
                  }
                }, {
                  // remove serverOnly() calls (replace with undefined)
                  functionName: 'serverOnly',
                  magicImports: ['startupjs'],
                  replaceWith: {
                    remove: true // replace the whole function call with undefined
                  }
                }]
              }
            : {}
          )
        }],

        // debugging features
        require('@startupjs/babel-plugin-startupjs-debug'),
        require('@startupjs/babel-plugin-i18n-extract')
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

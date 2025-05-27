// TODO: add support for source maps
const babel = require('@babel/core')
const { isStartupjsPluginEcosystemFile, CONFIG_FILENAME_REGEX } = require('./utils')

const PLUGIN_KEYS = ['name', 'for', 'order', 'enabled']
const PROJECT_KEYS = ['plugins', 'modules']
const ALL_ENVS = ['features', 'isomorphic', 'client', 'server', 'build']
const MAGIC_IMPORTS = ['startupjs/registry', '@startupjs/registry']

module.exports = function eliminatorLoader (source) {
  const filename = this.resourcePath

  // transform server-only code to client code in model/*.js files
  // - replace aggregation() with aggregationHeader()
  // - remove accessControl() calls
  const clientModel = this.query.clientModel

  // ensure that this loader is only used on plugins, startupjs.config.js and loadStartupjsConfig.js files.
  // Or on the client it should also run in model/*.js files
  if (!(
    isStartupjsPluginEcosystemFile(filename) ||
    (clientModel && isModelFile(filename, source))
  )) return source

  const envs = this.query.envs
  if (!envs) throw Error("eliminatorLoader: envs not provided (for example ['features', 'isomorphic', 'client'])")

  const useRequireContext = this.query.useRequireContext

  let code = source

  // STEP 1: convert pug to jsx and auto-load startupjs plugins
  code = babel.transformSync(code, {
    filename,
    babelrc: false,
    configFile: false,
    plugins: [
      // support JSX syntax
      require('@babel/plugin-syntax-jsx'),
      // transform pug to jsx. This generates a bunch of new AST nodes
      // (it's important to do this first before any dead code elimination runs)
      [require('@startupjs/babel-plugin-transform-react-pug'), {
        classAttribute: 'styleName'
      }],
      // support calling sub-components in pug (like <Modal.Header />)
      [require('@startupjs/babel-plugin-react-pug-classnames'), {
        classAttribute: 'styleName'
      }],
      // traverse "exports" of package.json and all dependencies to find all startupjs plugins
      // and automatically import them in the main startupjs.config.js file
      [require('@startupjs/babel-plugin-startupjs-plugins'), { useRequireContext }]
    ]
  }).code

  // STEP 2: remove code related to other envs
  code = babel.transformSync(code, {
    filename,
    babelrc: false,
    configFile: false,
    plugins: [
      // support JSX syntax
      require('@babel/plugin-syntax-jsx'),
      // run eliminator to remove code targeting other envs.
      // For example, only keep code related to 'client' and 'isomorphic' envs
      // (in which case any code related to 'server' and 'build' envs will be removed)
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
        }],
        ...(clientModel
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
      }]
    ]
  }).code

  return code
}

const MODEL_FILE_REGEX = /(?:^|[.\\/])model[\\/].*\.[mc]?[jt]sx?$/
const STARTUPJS_REGEX = /['"]startupjs['"]/
function isModelFile (filename, code) {
  return MODEL_FILE_REGEX.test(filename) && STARTUPJS_REGEX.test(code)
}

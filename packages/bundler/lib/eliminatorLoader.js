// TODO: add support for source maps
const babel = require('@babel/core')
const { isStartupjsPluginEcosystemFile, CONFIG_FILENAME_REGEX } = require('./utils')

const PLUGIN_KEYS = ['name', 'for', 'order', 'enabled']
const PROJECT_KEYS = ['plugins', 'modules']
const ALL_ENVS = ['features', 'isomorphic', 'client', 'server', 'build']
const MAGIC_IMPORTS = ['startupjs/registry', '@startupjs/registry']

module.exports = function eliminatorLoader (source) {
  const filename = this.resourcePath

  // ensure that this loader is only used on plugins, startupjs.config.js and loadStartupjsConfig.js files
  if (!(isStartupjsPluginEcosystemFile(filename))) return source

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
        }]
      }]
    ]
  }).code

  return code
}

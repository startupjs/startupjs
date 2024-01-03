const babel = require('@babel/core')

const PLUGIN_KEYS = ['name', 'for']
const ALL_ENVS = ['client', 'isomorphic', 'server', 'build']
const MAGIC_IMPORTS = ['startupjs/registry', '@startupjs/registry']
const MAGIC_IMPORTS_REGEX = /['"]@?startupjs\/registry['"]/

module.exports = function eliminatorLoader (source) {
  // ensure that this loader is only used when the magic import is present
  if (!MAGIC_IMPORTS_REGEX.test(source)) return source

  const envs = this.query.envs
  if (!envs) throw Error("eliminatorLoader: envs not provided (for example ['client', 'isomorphic'])")
  const filename = this.resourcePath

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
      [require('babel-plugin-transform-react-pug'), {
        classAttribute: 'styleName'
      }],
      // support calling sub-components in pug (like <Modal.Header />)
      [require('@startupjs/babel-plugin-react-pug-classnames'), {
        classAttribute: 'styleName'
      }],
      // traverse "exports" of package.json and all dependencies to find all startupjs plugins
      // and automatically import them in the main startupjs.config.js file
      require('@startupjs/babel-plugin-startupjs-plugins')
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
  }).code

  return code
}

const babel = require('@babel/core')

const PLUGIN_KEYS = ['name', 'for']
const ALL_ENVS = ['client', 'isomorphic', 'server', 'build']

module.exports = function eliminatorLoader (source) {
  const envs = this.query.envs
  if (!envs) throw Error("getEliminatorLoader: envs not provided (for example ['client', 'isomorphic'])")
  const filename = this.resourcePath

  // first we need to transform pug to jsx
  // so that eliminator doesn't think that there are unused variables
  let code = babel.transformSync(source, {
    filename,
    babelrc: false,
    configFile: false,
    plugins: [
      require('@babel/plugin-syntax-jsx'),
      [require('babel-plugin-transform-react-pug'), {
        classAttribute: 'styleName'
      }],
      [require('@startupjs/babel-plugin-react-pug-classnames'), {
        classAttribute: 'styleName'
      }]
    ]
  }).code

  // then we run the actual eliminator to remove env-specific stuff
  code = babel.transformSync(source, {
    filename,
    babelrc: false,
    configFile: false,
    plugins: [
      [require('@startupjs/babel-plugin-eliminator'), {
        keepObjectKeysOfFunction: {
          createProject: {
            magicImports: ['startupjs/registry', 'startupjs/registry.js', '@startupjs/registry', '@startupjs/registry.js'],
            targetObjectJsonPath: '$.plugins.*',
            ensureOnlyKeys: ['client', 'isomorphic', 'server', 'build'],
            keepKeys: envs
          },
          createPlugin: {
            magicImports: ['startupjs/registry', 'startupjs/registry.js', '@startupjs/registry', '@startupjs/registry.js'],
            ensureOnlyKeys: [...PLUGIN_KEYS, ...ALL_ENVS],
            keepKeys: [...PLUGIN_KEYS, ...envs]
          }
        }
      }]
    ]
  }).code

  return code
}

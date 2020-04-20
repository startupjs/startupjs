const genericNames = require('generic-names')
const { LOCAL_IDENT_NAME } = require('./constants')
const ASYNC = process.env.ASYNC

const DIRECTORY_ALIASES = {
  components: './components',
  helpers: './helpers',
  clientHelpers: './clientHelpers',
  model: './model',
  main: './main',
  styles: './styles',
  appConstants: './appConstants',
  config: './startupjs.config'
}

const clientPresets = [
  [require.resolve('metro-react-native-babel-preset'), {
    disableImportExportTransform: !!ASYNC
  }]
]

const serverPresets = [require.resolve('metro-react-native-babel-preset')]

const basePlugins = ({ legacyClassnames } = {}) => [
  [require.resolve('babel-plugin-transform-react-pug'), {
    classAttribute: 'styleName'
  }],
  [require.resolve('babel-plugin-react-pug-classnames'), {
    classAttribute: 'styleName',
    legacy: legacyClassnames
  }],
  [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }]
]

const dotenvPlugin = ({ production } = {}) =>
  [require.resolve('@startupjs/babel-plugin-dotenv-import'), {
    moduleName: '@env',
    path: ['.env', production ? '.env.production' : '.env.local'],
    safe: true,
    allowUndefined: true
  }]

const webReactCssModulesPlugin = ({ production } = {}) =>
  [require.resolve('@startupjs/babel-plugin-react-css-modules'), {
    handleMissingStyleName: 'ignore',
    filetypes: {
      '.styl': {}
    },
    generateScopedName,
    webpackHotModuleReloading: !production
  }]

const nativeBasePlugins = () => [
  [require.resolve('babel-plugin-react-native-dynamic-stylename-to-style'), {
    extensions: ['styl', 'css']
  }],
  [require.resolve('babel-plugin-react-native-platform-specific-extensions'), {
    extensions: ['styl', 'css']
  }]
]

const webBasePlugins = () => [
  require.resolve('babel-plugin-react-native-web-pass-classname')
]

const config = {
  development: {
    presets: clientPresets,
    plugins: [
      dotenvPlugin(),
      ...nativeBasePlugins()
    ]
  },
  production: {
    presets: clientPresets,
    plugins: [
      dotenvPlugin({ production: true }),
      ...nativeBasePlugins()
    ]
  },
  web_development: {
    presets: clientPresets,
    plugins: [
      require.resolve('react-hot-loader/babel'),
      dotenvPlugin(),
      webReactCssModulesPlugin(),
      ...webBasePlugins()
    ]
  },
  web_production: {
    presets: clientPresets,
    plugins: [
      dotenvPlugin({ production: true }),
      webReactCssModulesPlugin({ production: true }),
      ...webBasePlugins()
    ]
  },
  server: {
    presets: serverPresets,
    plugins: [
      [require.resolve('@babel/plugin-transform-runtime'), {
        regenerator: true
      }]
    ]
  }
}

module.exports = options => {
  const { alias = {} } = options
  const { BABEL_ENV, NODE_ENV } = process.env
  // There is a bug in metro when BABEL_ENV is a string "undefined".
  // We have to workaround it and use NODE_ENV.
  const env = (BABEL_ENV !== 'undefined' && BABEL_ENV) || NODE_ENV
  const { presets = [], plugins = [] } = config[env] || {}
  const resolverPlugin = [require.resolve('babel-plugin-module-resolver'), {
    alias: {
      ...DIRECTORY_ALIASES,
      ...alias
    }
  }]

  return {
    presets,
    plugins: [resolverPlugin].concat(basePlugins(options), plugins)
  }
}

function generateScopedName (name, filename/* , css */) {
  let hashSize = LOCAL_IDENT_NAME.match(/base64:(\d+)]/)
  if (!hashSize) {
    throw new Error(
      'wrong LOCAL_IDENT_NAME. Change generateScopeName() accordingly'
    )
  }
  hashSize = Number(hashSize[1])
  if (new RegExp(`_.{${hashSize}}_$`).test(name)) return name
  return genericNames(LOCAL_IDENT_NAME)(name, filename)
}

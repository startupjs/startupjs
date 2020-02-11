const genericNames = require('generic-names')
const { LOCAL_IDENT_NAME } = require('./buildOptions')
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
  ['module:metro-react-native-babel-preset', {
    disableImportExportTransform: !!ASYNC
  }]
]

const serverPresets = ['module:metro-react-native-babel-preset']

const basePlugins = ({ legacyClassnames } = {}) => [
  ['transform-react-pug', {
    classAttribute: 'styleName'
  }],
  ['react-pug-classnames', {
    classAttribute: 'styleName',
    legacy: legacyClassnames
  }],
  ['@babel/plugin-proposal-decorators', { legacy: true }]
]

const dotenvPlugin = ({ production } = {}) =>
  ['@startupjs/dotenv-import', {
    moduleName: '@env',
    path: ['.env', production ? '.env.production' : '.env.local'],
    safe: true,
    allowUndefined: true
  }]

const csstaPlugins = () => [
  ['babel-plugin-cssta-stylename', {
    classAttribute: 'styleName',
    addCssHash: true,
    extensions: ['attr.css', 'attr.styl'],
    wrapInMemo: false
  }],
  'babel-plugin-cssta'
]

const webReactCssModulesPlugin = ({ production } = {}) =>
  ['@startupjs/react-css-modules', {
    handleMissingStyleName: 'ignore',
    filetypes: {
      '.styl': {}
    },
    skipExtensions: ['attr.css', 'attr.styl'],
    generateScopedName,
    webpackHotModuleReloading: !production
  }]

const nativeBasePlugins = () => [
  ['react-native-dynamic-stylename-to-style', {
    extensions: ['styl', 'css']
  }],
  [
    'react-native-platform-specific-extensions',
    {
      extensions: ['styl', 'css']
    }
  ]
]

const webBasePlugins = () => [
  'react-native-web-pass-classname'
]

const config = {
  development: {
    presets: clientPresets,
    plugins: [
      dotenvPlugin(),
      ...csstaPlugins(),
      ...nativeBasePlugins()
    ]
  },
  production: {
    presets: clientPresets,
    plugins: [
      dotenvPlugin({ production: true }),
      ...csstaPlugins(),
      ...nativeBasePlugins()
    ]
  },
  web_development: {
    presets: clientPresets,
    plugins: [
      'react-hot-loader/babel',
      dotenvPlugin(),
      ...csstaPlugins(),
      webReactCssModulesPlugin(),
      ...webBasePlugins()
    ]
  },
  web_production: {
    presets: clientPresets,
    plugins: [
      dotenvPlugin({ production: true }),
      ...csstaPlugins(),
      webReactCssModulesPlugin({ production: true }),
      ...webBasePlugins()
    ]
  },
  server: {
    presets: serverPresets,
    plugins: [
      ['@babel/plugin-transform-runtime', {
        regenerator: true
      }]
    ]
  }
}

module.exports = function (api, opts = {}) {
  const { alias = {} } = opts
  const env = api.env()
  const { presets = [], plugins = [] } = config[env] || {}
  const resolverPlugin = ['module-resolver', {
    alias: {
      ...DIRECTORY_ALIASES,
      ...alias
    }
  }]
  return { presets, plugins: [resolverPlugin].concat(basePlugins(opts), plugins) }
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

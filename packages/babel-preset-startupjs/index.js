const genericNames = require('generic-names')
const { LOCAL_IDENT_NAME } = require('./constants')
const ASYNC = process.env.ASYNC
const DEFAULT_MODE = 'react-native'

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
  [require.resolve('./metroWithTypescript'), {
    disableImportExportTransform: !!ASYNC
  }]
]

const serverPresets = [require.resolve('./metroWithTypescript')]

const basePlugins = ({ legacyClassnames, alias } = {}) => [
  [require.resolve('babel-plugin-module-resolver'), {
    alias: {
      ...DIRECTORY_ALIASES,
      ...alias
    }
  }],
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

const nativeReactCssModulesPlatformExtensionsPlugin = () =>
  [require.resolve('babel-plugin-react-native-platform-specific-extensions'), {
    extensions: ['styl', 'css']
  }]

const nativeReactCssModulesPlugin = () =>
  [require.resolve('@startupjs/babel-plugin-rn-stylename-to-style'), {
    extensions: ['styl', 'css']
  }]

const webPassClassnamePlugin = () =>
  require.resolve('babel-plugin-react-native-web-pass-classname')

// react-native config

const CONFIG_NATIVE_DEVELOPMENT = {
  presets: clientPresets,
  plugins: [
    dotenvPlugin(),
    nativeReactCssModulesPlatformExtensionsPlugin(),
    nativeReactCssModulesPlugin()
  ]
}

const CONFIG_NATIVE_PRODUCTION = {
  presets: clientPresets,
  plugins: [
    dotenvPlugin({ production: true }),
    nativeReactCssModulesPlatformExtensionsPlugin(),
    nativeReactCssModulesPlugin()
  ]
}

// web config for universal web/native project. Uses inline CSS styles, same as in react-native config,
// therefore only the react-native rules can be used.

const CONFIG_WEB_UNIVERSAL_DEVELOPMENT = {
  presets: clientPresets,
  plugins: [
    require.resolve('react-hot-loader/babel'),
    dotenvPlugin(),
    nativeReactCssModulesPlugin()
  ]
}

const CONFIG_WEB_UNIVERSAL_PRODUCTION = {
  presets: clientPresets,
  plugins: [
    dotenvPlugin({ production: true }),
    nativeReactCssModulesPlugin()
  ]
}

// web config for a pure web project. Uses babel-plugin-react-css-modules for CSS which allows
// to use the full browser CSS engine.

const CONFIG_WEB_PURE_DEVELOPMENT = {
  presets: clientPresets,
  plugins: [
    require.resolve('react-hot-loader/babel'),
    dotenvPlugin(),
    webReactCssModulesPlugin(),
    webPassClassnamePlugin()
  ]
}

const CONFIG_WEB_PURE_PRODUCTION = {
  presets: clientPresets,
  plugins: [
    dotenvPlugin({ production: true }),
    webReactCssModulesPlugin({ production: true }),
    webPassClassnamePlugin()
  ]
}

// node.js server config

const CONFIG_SERVER = {
  presets: serverPresets,
  plugins: [
    [require.resolve('@babel/plugin-transform-runtime'), {
      regenerator: true
    }]
  ]
}

module.exports = (api, options) => {
  api.cache(true)

  const { BABEL_ENV, NODE_ENV, MODE = DEFAULT_MODE } = process.env

  console.log(BABEL_ENV, typeof BABEL_ENV, '!!!!BABEL_ENV')
  // There is a bug in metro when BABEL_ENV is a string "undefined".
  // We have to workaround it and use NODE_ENV.
  const env = (BABEL_ENV !== 'undefined' && BABEL_ENV) || NODE_ENV

  const { presets = [], plugins = [] } = getConfig(env, MODE)

  return {
    presets,
    plugins: basePlugins(options).concat(plugins)
  }
}

function getConfig (env, mode) {
  if (env === 'development') {
    return CONFIG_NATIVE_DEVELOPMENT
  } else if (env === 'production') {
    return CONFIG_NATIVE_PRODUCTION
  } else if (env === 'server') {
    return CONFIG_SERVER
  } else if (env === 'web_development') {
    if (mode === 'web') {
      return CONFIG_WEB_PURE_DEVELOPMENT
    } else {
      return CONFIG_WEB_UNIVERSAL_DEVELOPMENT
    }
  } else if (env === 'web_production') {
    if (mode === 'web') {
      return CONFIG_WEB_PURE_PRODUCTION
    } else {
      return CONFIG_WEB_UNIVERSAL_PRODUCTION
    }
  } else {
    return {}
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

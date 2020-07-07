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
  config: './startupjs.config.cjs'
}

const basePlugins = ({ alias } = {}) => [
  [require('babel-plugin-module-resolver'), {
    alias: {
      ...DIRECTORY_ALIASES,
      ...alias
    }
  }],
  [require('babel-plugin-transform-react-pug'), {
    classAttribute: 'styleName'
  }],
  [require('@startupjs/babel-plugin-react-pug-classnames'), {
    classAttribute: 'styleName'
  }],
  [require('@babel/plugin-proposal-decorators'), { legacy: true }]
]

const dotenvPlugin = ({ production, mockBaseUrl } = {}) => {
  const options = {
    moduleName: '@env',
    path: ['.env', production ? '.env.production' : '.env.local']
  }
  if (mockBaseUrl) {
    options.override = {
      BASE_URL: "typeof window !== 'undefined' && window.location && window.location.origin"
    }
  }
  return [require('@startupjs/babel-plugin-dotenv'), options]
}

const webReactCssModulesPlugin = ({ production } = {}) =>
  [require('@startupjs/babel-plugin-react-css-modules'), {
    handleMissingStyleName: 'ignore',
    filetypes: {
      '.styl': {}
    },
    generateScopedName,
    webpackHotModuleReloading: !production
  }]

const nativeReactCssModulesPlatformExtensionsPlugin = () =>
  [require('babel-plugin-react-native-platform-specific-extensions'), {
    extensions: ['styl', 'css']
  }]

const nativeReactCssModulesPlugin = () =>
  [require('@startupjs/babel-plugin-rn-stylename-to-style'), {
    extensions: ['styl', 'css']
  }]

const webPassClassnamePlugin = () =>
  require('babel-plugin-react-native-web-pass-classname')

// react-native config

const CONFIG_NATIVE_DEVELOPMENT = {
  presets: [
    [require('./metroPresetWithTypescript')]
  ],
  plugins: [
    dotenvPlugin(),
    nativeReactCssModulesPlatformExtensionsPlugin(),
    nativeReactCssModulesPlugin()
  ]
}

const CONFIG_NATIVE_PRODUCTION = {
  presets: [
    [require('./metroPresetWithTypescript')]
  ],
  plugins: [
    dotenvPlugin({ production: true }),
    nativeReactCssModulesPlatformExtensionsPlugin(),
    nativeReactCssModulesPlugin()
  ]
}

// web config for universal web/native project. Uses inline CSS styles, same as in react-native config,
// therefore only the react-native rules can be used.

const CONFIG_WEB_UNIVERSAL_DEVELOPMENT = {
  presets: [
    [require('./esNextPreset'), { debugJsx: true }]
    // NOTE: If we start to face unknown errors in development or
    //       want to sync the whole presets/plugins stack with RN,
    //       just replace the optimized esNext preset above with the
    //       regular metro preset below:
    // [require('./metroPresetWithTypescript')]
  ],
  plugins: [
    [require('react-refresh/babel'), { skipEnvCheck: true }],
    dotenvPlugin({ mockBaseUrl: true }),
    nativeReactCssModulesPlugin()
  ]
}

const CONFIG_WEB_UNIVERSAL_PRODUCTION = {
  presets: [
    [require('./metroPresetWithTypescript'), {
      disableImportExportTransform: !!ASYNC
    }]
  ],
  plugins: [
    ASYNC && require('@startupjs/babel-plugin-startupjs'),
    ASYNC && require('@startupjs/babel-plugin-import-to-react-lazy'),
    dotenvPlugin({ production: true, mockBaseUrl: true }),
    nativeReactCssModulesPlugin()
  ].filter(Boolean)
}

if (ASYNC) {
  CONFIG_WEB_UNIVERSAL_PRODUCTION.sourceType = 'unambiguous'
}

// web config for a pure web project. Uses babel-plugin-react-css-modules for CSS which allows
// to use the full browser CSS engine.

const CONFIG_WEB_PURE_DEVELOPMENT = {
  presets: [
    [require('./metroPresetWithTypescript')]
  ],
  plugins: [
    [require('react-refresh/babel'), { skipEnvCheck: true }],
    dotenvPlugin({ mockBaseUrl: true }),
    webReactCssModulesPlugin(),
    webPassClassnamePlugin()
  ]
}

const CONFIG_WEB_PURE_PRODUCTION = {
  presets: [
    [require('./metroPresetWithTypescript'), {
      disableImportExportTransform: !!ASYNC
    }]
  ],
  plugins: [
    dotenvPlugin({ production: true, mockBaseUrl: true }),
    webReactCssModulesPlugin({ production: true }),
    webPassClassnamePlugin()
  ]
}

// node.js server config

const CONFIG_SERVER = {
  presets: [
    require('./esNextPreset')
    // NOTE: If we start to face unknown errors or
    //       want to sync the whole presets/plugins stack with RN,
    //       just replace the optimized esNext preset above with the
    //       regular metro preset below:
    // [require('./metroPresetWithTypescript')]
  ],
  plugins: []
}

module.exports = (api, options) => {
  api.cache(true)

  const { BABEL_ENV, NODE_ENV, MODE = DEFAULT_MODE, VITE_WEB } = process.env

  // Ignore babel config when using Vite
  if (VITE_WEB) return {}

  // There is a bug in metro when BABEL_ENV is a string "undefined".
  // We have to workaround it and use NODE_ENV.
  const env = (BABEL_ENV !== 'undefined' && BABEL_ENV) || NODE_ENV

  const { presets = [], plugins = [], ...extra } = getConfig(env, MODE)

  return {
    presets,
    plugins: basePlugins(options).concat(plugins),
    ...extra
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

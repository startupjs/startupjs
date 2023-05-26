var stylusToCssLoader = require('@startupjs/bundler/lib/stylusToCssLoader.js')
const { generateScopedNameFactory } = require('@startupjs/babel-plugin-react-css-modules/utils')
const { LOCAL_IDENT_NAME } = require('./constants')
const ASYNC = process.env.ASYNC
const APP_ENV = process.env.APP_ENV
const DEFAULT_MODE = 'react-native'

const DIRECTORY_ALIASES = {
  components: './components',
  helpers: './helpers',
  clientHelpers: './clientHelpers',
  model: './model',
  main: './main',
  styles: './styles',
  appConstants: './appConstants'
}

const basePlugins = ({ alias, observerCache } = {}) => [
  [require('@startupjs/babel-plugin-startupjs-utils'), {
    observerCache
  }],
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

const dotenvPlugin = ({ production, mockBaseUrl, envName = APP_ENV } = {}) => {
  if (!envName) {
    envName = production ? 'production' : 'local'
  }
  const options = {
    moduleName: '@env',
    path: ['.env', `.env.${envName}`]
  }
  if (mockBaseUrl) {
    options.override = {
      BASE_URL: "typeof window !== 'undefined' && window.location && window.location.origin"
    }
  }
  return [require('@startupjs/babel-plugin-dotenv'), options]
}

const i18nPlugin = (options) => {
  return [require('@startupjs/babel-plugin-i18n-extract'), options]
}

const webReactCssModulesPlugin = ({ production } = {}) =>
  ['@startupjs/babel-plugin-react-css-modules', {
    handleMissingStyleName: 'ignore',
    webpackHotModuleReloading: !production,
    filetypes: {
      '.styl': {}
    },
    transform: (src, filepath) => {
      if (!/\.styl$/.test(filepath)) return src
      return stylusToCssLoader.call({ resourcePath: filepath }, src)
    },
    generateScopedName
  }]

const nativeReactCssModulesPlatformExtensionsPlugin = () =>
  [require('babel-plugin-react-native-platform-specific-extensions'), {
    extensions: ['styl', 'css']
  }]

const nativeReactCssModulesPlugins = ({ platform, useImport } = {}) => [
  [require('@startupjs/babel-plugin-rn-stylename-to-style'), {
    extensions: ['styl', 'css'],
    useImport
  }],
  [require('@startupjs/babel-plugin-rn-stylename-inline'), {
    platform
  }]
]

// react-native config

const CONFIG_NATIVE_DEVELOPMENT = {
  presets: [
    [require('./metroPresetWithTypescript')]
  ],
  plugins: [
    [require('@startupjs/babel-plugin-startupjs-debug')],
    dotenvPlugin(),
    nativeReactCssModulesPlatformExtensionsPlugin(),
    ...nativeReactCssModulesPlugins({ useImport: false }),
    i18nPlugin()
  ]
}

const CONFIG_NATIVE_PRODUCTION = {
  presets: [
    [require('./metroPresetWithTypescript')]
  ],
  plugins: [
    dotenvPlugin({ production: true }),
    nativeReactCssModulesPlatformExtensionsPlugin(),
    ...nativeReactCssModulesPlugins({ useImport: false }),
    i18nPlugin()
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
    [require('@startupjs/babel-plugin-startupjs-debug')],
    [require('react-refresh/babel'), { skipEnvCheck: true }],
    dotenvPlugin({ mockBaseUrl: true }),
    ...nativeReactCssModulesPlugins({ platform: 'web' }),
    i18nPlugin({ collectTranslations: true })
  ]
}

const CONFIG_WEB_SNOWPACK = {
  presets: [
    [require('./esNextPreset'), { debugJsx: true }]
    // NOTE: If we start to face unknown errors in development or
    //       want to sync the whole presets/plugins stack with RN,
    //       just replace the optimized esNext preset above with the
    //       regular metro preset below:
    // [require('./metroPresetWithTypescript')]
  ],
  plugins: [
    require('@startupjs/babel-plugin-startupjs'),
    require('@startupjs/babel-plugin-import-to-react-lazy'),
    dotenvPlugin({ mockBaseUrl: true }),
    ...nativeReactCssModulesPlugins({ platform: 'web' })
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
    ...nativeReactCssModulesPlugins({ platform: 'web' }),
    i18nPlugin({ collectTranslations: true })
  ].filter(Boolean)
}

if (ASYNC) {
  CONFIG_WEB_UNIVERSAL_PRODUCTION.sourceType = 'unambiguous'
}

// web config for a pure web project. Uses babel-plugin-react-css-modules for CSS which allows
// to use the full browser CSS engine.

const CONFIG_WEB_PURE_DEVELOPMENT = {
  presets: [
    [require('./esNextPreset'), { debugJsx: true }]
    // NOTE: If we start to face unknown errors in development or
    //       want to sync the whole presets/plugins stack with RN,
    //       just replace the optimized esNext preset above with the
    //       regular metro preset below:
    // [require('./metroPresetWithTypescript')]
  ],
  plugins: [
    [require('@startupjs/babel-plugin-startupjs-debug')],
    [require('react-refresh/babel'), { skipEnvCheck: true }],
    dotenvPlugin({ mockBaseUrl: true }),
    webReactCssModulesPlugin(),
    i18nPlugin({ collectTranslations: true })
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
    i18nPlugin({ collectTranslations: true })
  ]
}

if (ASYNC) {
  CONFIG_WEB_PURE_PRODUCTION.sourceType = 'unambiguous'
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

  const { BABEL_ENV, NODE_ENV, MODE = DEFAULT_MODE, VITE_WEB, SNOWPACK_WEB } = process.env

  // There is a bug in metro when BABEL_ENV is a string "undefined".
  // We have to workaround it and use NODE_ENV.
  let env = (BABEL_ENV !== 'undefined' && BABEL_ENV) || NODE_ENV
  if (VITE_WEB) env = 'web_vite'
  if (SNOWPACK_WEB) env = 'web_snowpack'

  // Ignore babel config when using Vite
  if (env === 'web_vite') return {}

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
  } else if (env === 'web_snowpack') {
    return CONFIG_WEB_SNOWPACK
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
  return generateScopedNameFactory(LOCAL_IDENT_NAME)(name, filename)
}

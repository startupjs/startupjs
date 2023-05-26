const { getPluginConfigs } = require('@startupjs/plugin/manager.cjs')
const pickBy = require('lodash/pickBy')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const PROD = !process.env.WEBPACK_DEV
const BUILD_DIR = '/build/'
const BUILD_PATH = path.join(process.cwd(), BUILD_DIR)
const PLUGINS = getPluginConfigs()

const EXTENSIONS = ['.server.js', '.server.jsx', '.server.ts', '.server.tsx', '.server.cjs', '.server.mjs', '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json']

const DEFAULT_ALIAS = {
}

module.exports = function getConfig (env, {
  forceCompileModules = [],
  modulesDir = 'node_modules',
  alias = {}
} = {}) {
  process.env.BABEL_ENV = 'server'

  if (typeof forceCompileModules === 'string') {
    forceCompileModules = JSON.parse(forceCompileModules)
  }
  if (typeof alias === 'string') {
    alias = JSON.parse(alias)
  }
  forceCompileModules = forceCompileModules
    .concat(getPluginsForceCompileList())

  forceCompileModules = forceCompileModules.map(moduleName => {
    return new RegExp('^' + moduleName + '($|/)')
  })
  return pickBy({
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals({ // in order to ignore all modules in node_modules folder
      modulesDir,
      allowlist: forceCompileModules
    })], // in order to ignore all modules in node_modules folder
    mode: PROD ? 'production' : 'development',
    devtool: 'source-map',
    entry: {
      server: ['@babel/polyfill', './server.js']
    },
    plugins: [
      // TODO: Reenable progress plugin if the following issue gets fixed:
      //       https://github.com/open-cli-tools/concurrently/issues/85
      // new webpack.ProgressPlugin()
    ],
    output: {
      path: BUILD_PATH,
      filename: PROD ? '[name].cjs' : '[name].dev.cjs'
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          resolve: {
            fullySpecified: false
          },
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      extensions: EXTENSIONS,
      alias: {
        ...DEFAULT_ALIAS,
        ...alias
      }
    }
  }, Boolean)
}

function getPluginsForceCompileList () {
  let list = []
  for (const plugin in PLUGINS) {
    const value = PLUGINS[plugin]?.bundler?.forceCompile?.server
    if (value === true) list.push(plugin)
    if (Array.isArray(value)) list = list.concat(value)
  }
  return list
}

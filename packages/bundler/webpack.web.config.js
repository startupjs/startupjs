const pickBy = require('lodash/pickBy')
const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { LOCAL_IDENT_NAME } = require('./buildOptions')
const { getJsxRule } = require('./helpers')
const autoprefixer = require('autoprefixer')
const rem2pixel = require('@startupjs/postcss-rem-to-pixel')
const stylusHashPlugin = require('@dmapper/stylus-hash-plugin')
const VERBOSE = process.env.VERBOSE
const DEV_PORT = ~~process.env.DEV_PORT || 3010
const PROD = !process.env.WEBPACK_DEV
const STYLES_PATH = path.join(process.cwd(), '/styles/index.styl')
const CONFIG_PATH = path.join(process.cwd(), '/startupjs.config')
const { ui } = require(CONFIG_PATH)
const BUILD_DIR = '/build/client/'
const BUILD_PATH = path.join(process.cwd(), BUILD_DIR)
const BUNDLE_NAME = 'main'

// Turn on support of asynchronously loaded chunks (dynamic import())
// This will make a separate mini-bundle (chunk) for each npm module (from node_modules)
// and each component from the /components/ folder
const ASYNC = process.env.ASYNC
if (ASYNC) console.log('[dm-bundler] ASYNC optimization is turned ON')

const EXTENSIONS = ['.web.js', '.js', '.web.jsx', '.jsx', '.json']
const ASYNC_EXTENSIONS = EXTENSIONS.map(i => '.async' + i)

const DEFAULT_FORCE_COMPILE_MODULES = [
  'startupjs/init',
  '@startupjs/init'
]
const DEFAULT_ALIAS = {
  // fix warning requiring './locale': https://github.com/moment/moment/issues/1435
  moment$: 'moment/moment.js',
  'react-native': 'react-native-web',
  'react-router-native': 'react-router-dom'
}

// Enable hooks hot reloading in development:
// https://github.com/gaearon/react-hot-loader#hot-loaderreact-dom
if (!PROD) {
  DEFAULT_ALIAS['react-dom'] = '@hot-loader/react-dom'
}

let DEFAULT_ENTRIES = [
  '@babel/polyfill'
]
// Enable hot reloading in development:
if (!PROD) {
  DEFAULT_ENTRIES.push('react-hot-loader/patch')
}

module.exports = function getConfig (env, {
  forceCompileModules = [],
  alias = {}
} = {}) {
  process.env.BABEL_ENV = PROD ? 'web_production' : 'web_development'

  if (typeof forceCompileModules === 'string') {
    forceCompileModules = JSON.parse(forceCompileModules)
  }
  if (typeof alias === 'string') {
    alias = JSON.parse(alias)
  }
  // array must be non-empty to prevent matching all node_modules via regex
  forceCompileModules = forceCompileModules.concat(DEFAULT_FORCE_COMPILE_MODULES)

  return pickBy({
    mode: PROD ? 'production' : 'development',
    entry: {
      [BUNDLE_NAME]: DEFAULT_ENTRIES.concat(['./index.web.js'])
    },
    optimization: (PROD || ASYNC) && pickBy({
      minimizer: PROD && [
        new TerserPlugin({
          cache: false,
          parallel: true,
          sourceMap: false // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: ASYNC && {
        maxInitialRequests: Infinity,
        maxAsyncRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            chunks: 'async',
            test: /[\\/]node_modules[\\/]/,
            name (module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](@[^\\/]+[\\/][^\\/]+|[^@\\/]+)([\\/]|$)/)[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '').replace(/[\\/]/, '_')}`
            }
          },
          components: {
            chunks: 'async',
            minChunks: 1,
            test: /[\\/]components[\\/][^\\/]+[\\/]/,
            name (module) {
              const componentName = module.context.match(/[\\/]components[\\/](.*?)([\\/]|$)/)[1]
              return `component.${componentName}`
            }
          }
        }
      }
    }, Boolean),
    plugins: [
      !VERBOSE && !PROD && new FriendlyErrorsWebpackPlugin(),
      new MomentLocalesPlugin(), // strip all locales except 'en'
      PROD && new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].[chunkhash].css'
      }),
      PROD && new AssetsPlugin({
        filename: 'assets.json',
        fullPath: false,
        path: BUILD_PATH
      })
    ].filter(Boolean),
    output: {
      path: BUILD_PATH,
      publicPath: PROD ? BUILD_DIR : `http://localhost:${DEV_PORT}${BUILD_DIR}`,
      filename: PROD ? '[name].[chunkhash].js' : '[name].js'
    },
    module: {
      rules: [
        Object.assign(getJsxRule(), {
          exclude: /node_modules/
        }),
        Object.assign(getJsxRule(), {
          include: new RegExp(`node_modules/(?:${forceCompileModules.join('|')})`)
        }),
        {
          test: /\.(jpg|png|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[hash].[ext]',
              publicPath: '/build/client/'
            }
          }
        },
        {
          test: /\.styl$/,
          use: [
            {
              loader: PROD ? MiniCssExtractPlugin.loader : 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: LOCAL_IDENT_NAME
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer, rem2pixel]
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                use: ui ? [stylusHashPlugin('$UI', ui)] : [],
                import: [STYLES_PATH],
                define: {
                  __WEB__: true
                }
              }
            }
          ]
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            {
              loader: PROD ? MiniCssExtractPlugin.loader : 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: LOCAL_IDENT_NAME
              }
            }
          ]
        },
        // Vendor stylesheets
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            {
              loader: PROD ? MiniCssExtractPlugin.loader : 'style-loader'
            },
            {
              loader: 'css-loader'
            }
          ]
        }
      ]
    },
    resolve: {
      alias: {
        ...DEFAULT_ALIAS,
        ...alias
      },
      extensions: ASYNC ? ASYNC_EXTENSIONS.concat(EXTENSIONS) : EXTENSIONS,
      mainFields: ['jsnext:main', 'browser', 'main']
    },
    devServer: {
      host: '0.0.0.0',
      port: 3010,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      publicPath: '/build/client/'
    }
  }, Boolean)
}

const pickBy = require('lodash/pickBy')
const pick = require('lodash/pick')
const fs = require('fs')
const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { LOCAL_IDENT_NAME } = require('babel-preset-startupjs/constants')
const { getJsxRule } = require('./helpers')
const autoprefixer = require('autoprefixer')
const stylusHashPlugin = require('@dmapper/stylus-hash-plugin')
const VERBOSE = process.env.VERBOSE
const DEV_PORT = ~~process.env.DEV_PORT || 3010
const PROD = !process.env.WEBPACK_DEV
const STYLES_PATH = path.join(process.cwd(), '/styles/index.styl')
const CONFIG_PATH = path.join(process.cwd(), '/startupjs.config')
const BUILD_DIR = '/build/client/'
const BUILD_PATH = path.join(process.cwd(), BUILD_DIR)
const BUNDLE_NAME = 'main'
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const DEFAULT_MODE = 'react-native'

// Get ui config if it exists
let ui
try {
  const startupjsConfig = require(CONFIG_PATH)
  ui = startupjsConfig && startupjsConfig.ui
} catch (err) {}

// Turn on support of asynchronously loaded chunks (dynamic import())
// This will make a separate mini-bundle (chunk) for each npm module (from node_modules)
// and each component from the /components/ folder
const ASYNC = process.env.ASYNC
if (ASYNC) console.log('[dm-bundler] ASYNC optimization is turned ON')

const EXTENSIONS = ['.web.js', '.js', '.web.jsx', '.jsx', '.mjs', '.cjs', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json']

const DEFAULT_FORCE_COMPILE_MODULES = [
  '@startupjs/init/src',
  '@startupjs/app',
  '@startupjs/ui',
  'react-native-collapsible' // used by ui
]
const DEFAULT_ALIAS = {
  // fix warning requiring './locale': https://github.com/moment/moment/issues/1435
  moment$: 'moment/moment.js',
  'react-native': 'react-native-web',
  'react-router-native': 'react-router-dom'
}

let DEFAULT_ENTRIES = [
  '@babel/polyfill'
]

module.exports = function getConfig (env, {
  forceCompileModules = [],
  alias = {},
  mode = DEFAULT_MODE
} = {}) {
  process.env.BABEL_ENV = PROD ? 'web_production' : 'web_development'
  process.env.MODE = mode

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
          config: {
            chunks: 'async',
            test: /[\\/](startupjs|ui)[.\\/].*config/,
            name (module) {
              return 'startupjs.config'
            }
          },
          components: {
            chunks: 'async',
            test: /[\\/]components[\\/][^\\/]+[\\/].*\.(jsx?|styl)$/,
            name (module) {
              const match = module.context.match(/[\\/]components[\\/]([^\\/]+)(?:[\\/]|$)([^\\/]+)?/)
              const [, first, second] = match
              // support components within grouping folders, for example 'components/forms/Input'
              if (/^[a-z]/.test(first) && second) {
                return `component.${first}.${second}`
              } else {
                return `component.${first}`
              }
            }
          },
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
          root: {
            chunks: 'async',
            test: /[\\/]Root[\\/]/,
            name (module) {
              return 'root'
            }
          },
          mdx: {
            chunks: 'async',
            minChunks: 1,
            test: /\.mdx$/,
            name (module) {
              const docName = module.resource.match(/[\\/]([^\\/]+)\.mdx$/)[1]
              return `mdx.${docName}`
            }
          },
          packages: {
            chunks: 'async',
            test: /[\\/]packages[\\/](?!ui\/(?:components|config)\/)/,
            name (module) {
              const packageName = module.context.match(/[\\/]packages[\\/](@[^\\/]+[\\/][^\\/]+|[^@\\/]+)([\\/]|$)/)[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `package.${packageName.replace('@', '').replace(/[\\/]/, '_')}`
            }
          }
        }
      }
    }, Boolean),
    plugins: [
      !VERBOSE && !PROD && new FriendlyErrorsWebpackPlugin(),
      new MomentLocalesPlugin(), // strip all locales except 'en'
      !PROD && new ReactRefreshWebpackPlugin({ forceEnable: true, overlay: { sockPort: DEV_PORT } }),
      PROD && new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].[chunkhash].css'
      }),
      PROD && new AssetsPlugin({
        filename: 'assets.json',
        fullPath: false,
        path: BUILD_PATH
      }),
      new ProgressBarPlugin({
        format: '\u001b[1m\u001b[32m:percent\u001b[0m (:elapsed seconds)'
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
          include: new RegExp(`node_modules/(?:react-native-(?!web)|${forceCompileModules.join('|')})`)
        }),
        {
          test: /\.mdx$/,
          exclude: /node_modules/,
          use: [
            pick(getJsxRule(), ['loader', 'options']),
            {
              loader: '@mdx-js/loader'
            },
            {
              loader: require.resolve('./lib/mdxExamplesLoader.js')
            }
          ]
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack'
            }
          ]
        },
        {
          test: /\.(jpg|png)$/,
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
          use: mode === 'web' ? [
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
                plugins: [autoprefixer]
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                use: ui ? [stylusHashPlugin('$UI', ui)] : [],
                import: fs.existsSync(STYLES_PATH) ? [STYLES_PATH] : [],
                define: {
                  __WEB__: true
                }
              }
            }
          ] : [
            pick(getJsxRule(), ['loader', 'options']),
            {
              loader: require.resolve('./lib/cssToReactNativeLoader.js')
            },
            {
              loader: require.resolve('./lib/stylusToCssLoader.js'),
              options: {
                platform: 'web'
              }
            }
          ]
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: mode === 'web' ? [
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
          ] : [
            pick(getJsxRule(), ['loader', 'options']),
            {
              loader: require.resolve('./lib/cssToReactNativeLoader.js')
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
      extensions: EXTENSIONS,
      mainFields: ['jsnext:main', 'browser', 'main']
    },
    devServer: {
      host: '0.0.0.0',
      port: DEV_PORT,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      publicPath: '/build/client/'
    }
  }, Boolean)
}

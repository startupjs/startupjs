const { getPluginConfigs } = require('@startupjs/plugin/manager.cjs')
const { getLocalIdent } = require('@startupjs/babel-plugin-react-css-modules/utils')
const pickBy = require('lodash/pickBy')
const fs = require('fs')
const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { LOCAL_IDENT_NAME } = require('babel-preset-startupjs/constants')
const autoprefixer = require('autoprefixer')
const DEV_PORT = ~~process.env.DEV_PORT || 3010
const PROD = !process.env.WEBPACK_DEV
const STYLES_PATH = path.join(process.cwd(), '/styles/index.styl')
const BUILD_DIR = '/build/client/'
const BUILD_PATH = path.join(process.cwd(), BUILD_DIR)
const BUNDLE_NAME = 'main'
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const webpack = require('webpack')
const DEFAULT_MODE = 'react-native'
const PLUGINS = getPluginConfigs()

// Turn on support of asynchronously loaded chunks (dynamic import())
// This will make a separate mini-bundle (chunk) for each npm module (from node_modules)
// and each component from the /components/ folder
const ASYNC = process.env.ASYNC
if (ASYNC) console.log('[dm-bundler] ASYNC optimization is turned ON')

const EXTENSIONS = ['.web.js', '.js', '.web.jsx', '.jsx', '.mjs', '.cjs', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json']

const DEFAULT_ALIAS = {
  // fix warning requiring './locale': https://github.com/moment/moment/issues/1435
  moment$: 'moment/moment.js',
  'react-native': 'react-native-web',
  'react-router-native': 'react-router-dom',
  '@fortawesome/react-native-fontawesome': '@fortawesome/react-fontawesome'
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
  forceCompileModules = forceCompileModules
    .concat(getPluginsForceCompileList())

  /**
   * path.normalize needs because webpack for Windows doesn't accept paths in
   * *nix format (with slash delemeter) in the include section.
   * .replace(/\\/g, '\\\\') needs for masking backslash in Windows-style paths
   * in the regular expression
   */
  const forceCompileModulesExpression = new RegExp(`${
      path.normalize('node_modules/')
    }(?:react-native-(?!web)|${
      forceCompileModules.map(v => path.normalize(v)).join('|')
    })`.replace(/\\/g, '\\\\')
  )

  return pickBy({
    mode: PROD ? 'production' : 'development',
    entry: {
      [BUNDLE_NAME]: DEFAULT_ENTRIES.concat(['./index.web.js'])
    },
    cache: !PROD && {
      type: 'filesystem',
      memoryCacheUnaffected: true,
      compression: 'brotli'
    },
    snapshot: !PROD && {
      // By default it's ['./node_modules'] which prevents us from updating
      // node_modules directly. We do it pretty often though, so that's why
      // we override managedPaths to an empty array here.
      //
      // TODO: Think whether it makes more sense to have node_modules
      //       be ignored by default but provide an additional option
      //       when you don't want to ignore them.
      managedPaths: []
    },
    experiments: !PROD && {
      cacheUnaffected: true
    },
    optimization: (PROD || ASYNC) && pickBy({
      minimizer: PROD && [
        new TerserPlugin({
          parallel: true
        }),
        new CssMinimizerPlugin()
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
              let packageName
              try {
                packageName = module.context.match(/[\\/]node_modules[\\/](@[^\\/]+[\\/][^\\/]+|[^@\\/]+)([\\/]|$)/)[1]
              } catch (err) {
                packageName = 'not_found'
              }
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
      // TODO: Reenable progress plugin if the following issue gets fixed:
      //       https://github.com/open-cli-tools/concurrently/issues/85
      // new webpack.ProgressPlugin(),
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
      new webpack.DefinePlugin({
        __DEV__: !PROD,
        global: 'window'
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser.js'
      })
    ].filter(Boolean),
    output: {
      path: BUILD_PATH,
      publicPath: PROD ? BUILD_DIR : `http://localhost:${DEV_PORT}${BUILD_DIR}`,
      filename: PROD ? '[name].[chunkhash].js' : '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.[mc]?[jt]sx?$/,
          resolve: {
            fullySpecified: false
          },
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' }
          ]
        },
        {
          test: /\.[mc]?[jt]sx?$/,
          resolve: {
            fullySpecified: false
          },
          include: forceCompileModulesExpression,
          use: [
            { loader: 'babel-loader' }
          ]
        },
        {
          test: /\.mdx?$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' },
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
        // TODO
        // https://webpack.js.org/guides/asset-modules/
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
                url: false, // NOTE can remove when change file loader to https://webpack.js.org/guides/asset-modules/
                modules: {
                  getLocalIdent,
                  localIdentName: LOCAL_IDENT_NAME
                }
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [autoprefixer]
                }
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                stylusOptions: {
                  use: [],
                  import: fs.existsSync(STYLES_PATH) ? [STYLES_PATH] : [],
                  define: {
                    __WEB__: true
                  }
                }
              }
            }
          ] : [
            { loader: 'babel-loader' },
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
                modules: {
                  getLocalIdent,
                  localIdentName: LOCAL_IDENT_NAME
                }
              }
            }
          ] : [
            { loader: 'babel-loader' },
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
        ...alias,
        process: 'process/browser.js'
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
      devMiddleware: {
        publicPath: '/build/client/'
      }
    }
  }, Boolean)
}

function getPluginsForceCompileList () {
  let list = []
  for (const plugin in PLUGINS) {
    const value = PLUGINS[plugin]?.bundler?.forceCompile?.web
    if (value === true) list.push(plugin)
    if (Array.isArray(value)) list = list.concat(value)
  }
  return list
}

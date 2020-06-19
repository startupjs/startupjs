const { exclude } = require('./includeExclude')
const nodePath = require('path')

const dotenvPlugin =
  [require('@startupjs/babel-plugin-dotenv'), {
    moduleName: '@env',
    path: ['.env', '.env.local']
  }]

const pugPlugins = [
  [require('babel-plugin-transform-react-pug'), {
    classAttribute: 'styleName'
  }],
  [require('@startupjs/babel-plugin-react-pug-classnames'), {
    classAttribute: 'styleName'
  }]
]

const stylePlugin =
  [require('@startupjs/babel-plugin-rn-stylename-to-style'), {
    extensions: ['styl', 'css'],
    modules: true
  }]

module.exports = {
  // TODO VITE figure out what this proxy is about
  test: (path, query) => {
    if (query && query['commonjs-proxy'] != null) return false
    return /\.([jt]sx?|mdx?)$/.test(path)
  },
  transform: (code, _, isBuild, path) => {
    let filename
    if (/^\/@modules\//.test(path)) {
      filename = path.replace('/@modules/', '')
      filename = nodePath.join(process.cwd(), '../node_modules', filename)
    } else {
      filename = path
    }
    let plugins = []
    if (/react-native-web/.test(path)) return code
    for (const pkg of exclude) {
      if (path.indexOf(pkg) !== -1) return code
    }
    if (/['"]@env['"]/.test(code)) {
      plugins.push(dotenvPlugin)
    }
    if (/pug`/.test(code)) {
      plugins = plugins.concat(pugPlugins, [stylePlugin])
    } else if (/[sS]tyleName/.test(code)) {
      plugins.push(stylePlugin)
    }
    // if (/['"]@startupjs\/ui['"]/.test(code)) {
    //   plugins.push(require('@startupjs/babel-plugin-startupjs'))
    // }
    if (/@asyncImports/.test(code)) {
      plugins.push(require('@startupjs/babel-plugin-import-to-react-lazy'))
    }
    if (plugins.length === 0) return code
    plugins.unshift(require('@babel/plugin-syntax-jsx'))
    code = require('@babel/core').transformSync(code, { plugins, filename }).code
    return code
  },
  before: true
}

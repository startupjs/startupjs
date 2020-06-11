const { exclude } = require('./includeExclude')

const pugPlugins = [
  [require('babel-plugin-transform-react-pug'), {
    classAttribute: 'styleName'
  }],
  [require('babel-plugin-react-pug-classnames'), {
    classAttribute: 'styleName',
    legacy: false,
    modules: true
  }]
]

const stylePlugin =
  [require('@startupjs/babel-plugin-rn-stylename-to-style'), {
    extensions: ['styl', 'css'],
    modules: true
  }]

// TODO VITE Add @env plugin, add babel-alias plugin.
module.exports = {
  test: (path) => /\.([jt]sx?|mdx?)$/.test(path),
  transform: (code, _, isBuild, path) => {
    let plugins = []
    if (/react-native-web/.test(path)) return code
    for (const pkg of exclude) {
      if (path.indexOf(pkg) !== -1) return code
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
    code = require('@babel/core').transformSync(code, { plugins }).code
    return code
  },
  before: true
}

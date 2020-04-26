// ref: https://github.com/kristerkari/react-native-stylus-transformer
const fs = require('fs')
const path = require('path')
const stylus = require('stylus')
const stylusHashPlugin = require('@dmapper/stylus-hash-plugin')
const poststylus = require('poststylus')
const rem2pixel = require('@startupjs/postcss-rem-to-pixel')

const STYLES_PATH = path.join(process.cwd(), 'styles/index.styl')
const CONFIG_PATH = path.join(process.cwd(), 'startupjs.config.js')

function renderToCSS (src, filename) {
  let compiled
  const compiler = stylus(src)
  compiler.set('filename', filename)

  // TODO: Make this a setting
  if (fs.existsSync(STYLES_PATH)) {
    compiler.import(STYLES_PATH)
  }

  if (fs.existsSync(CONFIG_PATH)) {
    const { ui } = require(CONFIG_PATH)
    if (ui) compiler.use(stylusHashPlugin('$UI', ui))
  }

  compiler.use(poststylus([rem2pixel])).render(function (err, res) {
    if (err) {
      throw new Error(err)
    }
    compiled = res
  })

  return compiled
}

module.exports = function stylusToReactNative (source) {
  return renderToCSS(source, this.resourcePath)
}

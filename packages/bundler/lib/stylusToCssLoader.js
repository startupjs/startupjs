// ref: https://github.com/kristerkari/react-native-stylus-transformer
const fs = require('fs')
const path = require('path')
const stylus = require('stylus')
const stylusHashPlugin = require('@dmapper/stylus-hash-plugin')

const STYLES_PATH = path.join(process.cwd(), 'styles/index.styl')
const CONFIG_PATH = path.join(process.cwd(), 'startupjs.config.js')

function renderToCSS (src, filename, platform) {
  let compiled
  const compiler = stylus(src)
  compiler.set('filename', filename)

  if (platform) {
    compiler.define('$PLATFORM', platform)
    compiler.define(`__${platform.toUpperCase()}__`, true)
  }

  // TODO: Make this a setting
  if (fs.existsSync(STYLES_PATH)) {
    compiler.import(STYLES_PATH)
  }

  if (fs.existsSync(CONFIG_PATH)) {
    const { ui } = require(CONFIG_PATH)
    if (ui) compiler.use(stylusHashPlugin('$UI', ui))
  }

  compiler.render(function (err, res) {
    if (err) {
      throw new Error(err)
    }
    compiled = res
  })

  return compiled
}

module.exports = function stylusToReactNative (source) {
  return renderToCSS(source, this.resourcePath, this.query && this.query.platform)
}

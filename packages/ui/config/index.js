const { generateColorsFromPalette } = require('./helpers')
const components = require('./components')
const pallete = require('./pallete')
const colors = generateColorsFromPalette(pallete)
const variables = require('./variables')

module.exports = {
  pallete,
  colors,
  ...components,
  ...variables
}

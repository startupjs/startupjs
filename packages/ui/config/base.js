const { PALLETE, generateColorsFromPalette } = require('./helpers')
const colors = generateColorsFromPalette()
const variables = require('./variables')

module.exports = {
  pallete: PALLETE,
  colors,
  ...variables
}

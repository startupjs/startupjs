const { PALLETE, generateColorsFromPalette } = require('./helpers')
const colors = generateColorsFromPalette()
const variables = require('./variables')

module.exports = function (pallete = PALLETE) {
  return {
    pallete,
    colors,
    ...variables
  }
}

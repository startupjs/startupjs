const { PALLETE, generateColorsFromPalette } = require('./helpers')
const variables = require('./variables')

module.exports = function (pallete = PALLETE) {
  return {
    pallete,
    colors: generateColorsFromPalette(pallete),
    ...variables
  }
}

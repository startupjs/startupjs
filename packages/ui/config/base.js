const { PALLETE, generateColorsFromPalette } = require('./helpers')
const variables = require('./variables')
const shadows = require('./shadows')

module.exports = function (pallete = PALLETE) {
  return {
    pallete,
    shadows,
    colors: generateColorsFromPalette(pallete),
    ...variables
  }
}

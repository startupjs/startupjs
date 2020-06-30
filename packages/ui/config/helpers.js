const colorToRGBA = require('./colorToRGBA')
const PALLETE = require('./palette')
const generateColorsFromPalette = require('./generateColorsFromPalette')

function u (value = 0) {
  return value * 8
}

module.exports = { PALLETE, generateColorsFromPalette, u, colorToRGBA }

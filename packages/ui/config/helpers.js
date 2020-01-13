const PALLETE = require('./pallete')
const _generateColorsFromPalette = require('./generateColorsFromPalette')

function generateColorsFromPalette (pallete = PALLETE) {
  return _generateColorsFromPalette(pallete)
}

function u (value = 0) {
  return value * 8
}

module.exports = { PALLETE, generateColorsFromPalette, u }

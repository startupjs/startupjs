const colorToRGBA = require('./colorToRGBA.cjs')
const PALLETE = require('./palette.json')
const generateColorsFromPalette = require('./generateColorsFromPalette.cjs')
const u = require('./u.cjs')
const media = require('./media.cjs')

module.exports = { PALLETE, generateColorsFromPalette, u, media, colorToRGBA }

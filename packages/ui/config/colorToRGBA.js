const Color = require('color')

const DEFAULT_OPACITY = 1

module.exports = function colorToRGBA (color, alpha) {
  const fadeRatio = (DEFAULT_OPACITY * 100 - alpha * 100) / 100
  return Color(color).fade(fadeRatio).toString()
}

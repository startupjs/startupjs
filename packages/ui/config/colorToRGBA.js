const Color = require('color')

module.exports = function colorToRGBA (color, alpha) {
  return Color(color).fade(alpha).toString()
}

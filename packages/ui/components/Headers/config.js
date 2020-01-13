const colors = require('./../../config/helpers').generateColorsFromPalette()

module.exports = function (config) {
  return {
    color: colors.mainText
  }
}

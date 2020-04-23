const { u } = require('./../../config/helpers')

module.exports = function ({ colors }) {
  return {
    heights: {
      xs: u(2),
      s: u(3),
      m: u(4),
      l: u(5),
      xl: u(6),
      xxl: u(7)
    },
    outlinedBorderWidth: 1,
    iconMargin: u(1)
  }
}

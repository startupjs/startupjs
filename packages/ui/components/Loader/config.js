const { u } = require('./../../config/helpers')

module.exports = function LoaderConfig () {
  return {
    sizes: {
      xs: u(2),
      s: u(2.5),
      m: u(3),
      l: u(4),
      xl: u(5),
      xxl: u(6)
    },
    bubbleSizes: {
      xs: 2,
      s: 3,
      m: u(0.5),
      l: 5,
      xl: u(0.75),
      xxl: u(1)
    },
    bubblesCount: 8
  }
}

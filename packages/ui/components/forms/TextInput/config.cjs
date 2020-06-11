const u = require('./../../../config-cjs/u.cjs')

module.exports = function TextInputConfig ({ colors }) {
  return {
    caretColor: colors.primary,
    borderWidth: 1,
    height: {
      l: u(5),
      m: u(4),
      s: u(3)
    },
    lineHeight: {
      l: u(3),
      m: u(2.5),
      s: u(2.5)
    }
  }
}

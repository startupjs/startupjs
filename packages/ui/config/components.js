const Layout = require('./../components/Layout/config')
const Span = require('./../components/Span/config')

module.exports = function (config) {
  return {
    Layout: Layout(config),
    Span: Span(config)
  }
}

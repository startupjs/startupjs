const Headers = require('./../components/Headers/config')
const Layout = require('./../components/Layout/config')
const Span = require('./../components/Span/config')
const TextInput = require('./../components/TextInput/config')

module.exports = function (config) {
  return {
    Headers: Headers(config),
    Layout: Layout(config),
    Span: Span(config),
    TextInput: TextInput(config)
  }
}

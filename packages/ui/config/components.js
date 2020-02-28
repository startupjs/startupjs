const Div = require('./../components/Div/config')
const Headers = require('./../components/Headers/config')
const Layout = require('./../components/Layout/config')
const Span = require('./../components/Span/config')
const TextInput = require('./../components/forms/TextInput/config')

module.exports = function (config) {
  return {
    Div: Div(config),
    Headers: Headers(config),
    Layout: Layout(config),
    Span: Span(config),
    TextInput: TextInput(config)
  }
}

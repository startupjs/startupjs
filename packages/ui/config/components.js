const Button = require('./../components/Button/config')
const Div = require('./../components/Div/config')
const Layout = require('./../components/Layout/config')
const Progress = require('./../components/Progress/config')
const Span = require('./../components/Typography/Span/config')
const TextInput = require('./../components/forms/TextInput/config')

module.exports = function (config) {
  return {
    Button: Button(config),
    Div: Div(config),
    Layout: Layout(config),
    Progress: Progress(config),
    Span: Span(config),
    TextInput: TextInput(config)
  }
}

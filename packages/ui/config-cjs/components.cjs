const Button = require('./../components/Button/config.cjs')
const Div = require('./../components/Div/config.cjs')
const Divider = require('./../components/Divider/config.cjs')
const Layout = require('./../components/Layout/config.cjs')
const Progress = require('./../components/Progress/config.cjs')
const Span = require('./../components/typography/Span/config.cjs')
const TextInput = require('./../components/forms/TextInput/config.cjs')

module.exports = function (config) {
  return {
    Button: Button(config),
    Div: Div(config),
    Divider: Divider(config),
    Layout: Layout(config),
    Progress: Progress(config),
    Span: Span(config),
    TextInput: TextInput(config)
  }
}

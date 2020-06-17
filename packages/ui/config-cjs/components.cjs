const Button = require('./../components/Button/config.cjs')
const Content = require('./../components/Content/config.cjs')
const Div = require('./../components/Div/config.cjs')
const Divider = require('./../components/Divider/config.cjs')
const Layout = require('./../components/Layout/config.cjs')
const Progress = require('./../components/Progress/config.cjs')
const TextInput = require('./../components/forms/TextInput/config.cjs')

module.exports = function (config) {
  return {
    Button: Button(config),
    Content: Content(config),
    Div: Div(config),
    Divider: Divider(config),
    Layout: Layout(config),
    Progress: Progress(config),
    TextInput: TextInput(config)
  }
}

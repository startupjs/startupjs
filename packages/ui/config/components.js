const Button = require('./../components/Button/config')
const Content = require('./../components/Content/config')
const Div = require('./../components/Div/config')
const Divider = require('./../components/Divider/config')
const Layout = require('./../components/Layout/config')
const Progress = require('./../components/Progress/config')
const TextInput = require('./../components/forms/TextInput/config')

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

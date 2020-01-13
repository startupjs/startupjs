const Layout = require('./../components/Layout/config')
const Progress = require('./../components/Progress/config')
const Span = require('./../components/Span/config')

module.exports = function (config) {
  return {
    Layout: Layout(config),
    Progress: Progress(config),
    Span: Span(config)
  }
}

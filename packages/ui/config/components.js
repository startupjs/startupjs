const Drawer = require('./../components/Drawer/config')
const Layout = require('./../components/Layout/config')
const Span = require('./../components/Span/config')
const SmartSidebar = require('./../components/SmartSidebar/config')
const Sidebar = require('./../components/Sidebar/config')

module.exports = function (config) {
  return {
    Drawer: Drawer(config),
    Layout: Layout(config),
    Span: Span(config),
    SmartSidebar: SmartSidebar(config),
    Sidebar: Sidebar(config)
  }
}

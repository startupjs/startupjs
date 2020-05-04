const getConfig = require('@startupjs/ui/config')

module.exports = {
  ui: getConfig({
    // you can override defaults for the UI components
    // and set you own global constants here.
    // Put here only the constants which you need to use across
    // multiple components or you need to get access to the constant
    // from both JS and CSS.
  })
}

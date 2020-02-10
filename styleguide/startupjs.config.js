const getConfig = require('@startupjs/ui/config')

module.exports = {
  ui: {
    ...getConfig(),
    darkMainBg: '#212121',
    darkSecondaryBg: '#333333'
  }
}

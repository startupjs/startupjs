const getConfig = require('@startupjs/ui/config-cjs/index.cjs')

// TODO VITE bring back startupjs.config ui override capability
module.exports = {
  ui: {
    ...getConfig()
  }
}

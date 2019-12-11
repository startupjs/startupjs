const getConfig = require('startupjs/bundler').babelConfig

module.exports = function (api) {
  const config = getConfig(api, {
    alias: {
      ui: '@startupjs/ui'
    }
  })
  return config
}

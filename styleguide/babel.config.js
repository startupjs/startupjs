const getConfig = require('startupjs/bundler').babelConfig

module.exports = function (api) {
  const config = getConfig(api, {
    legacyClassnames: false,
    alias: {
      ui: '@startupjs/ui'
    }
  })

  return config
}

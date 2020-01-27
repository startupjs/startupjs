const getConfig = require('startupjs/bundler').babelConfig

// const HEADERS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
// const isHeader = name => HEADERS.includes(name)

module.exports = function (api) {
  const config = getConfig(api, {
    legacyClassnames: false,
    alias: {
      ui: '@startupjs/ui'
    }
  })

  return config
}

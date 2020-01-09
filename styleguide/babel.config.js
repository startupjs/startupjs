const getConfig = require('startupjs/bundler').babelConfig

const HEADERS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
const isHeader = name => HEADERS.includes(name)

module.exports = function (api) {
  const config = getConfig(api, {
    alias: {
      ui: '@startupjs/ui'
    }
  })

  config.plugins = [
    ...config.plugins,
    ['@gzaripov/babel-plugin-transform-imports', {
      '@startupjs/ui': {
        transform: importName => `@startupjs/ui/components/${isHeader(importName) ? 'Headers' : importName}`,
        skipDefaultConversion: importName => isHeader(importName),
        preventFullImport: true
      }
    }]
  ]

  return config
}

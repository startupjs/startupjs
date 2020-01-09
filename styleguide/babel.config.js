const getConfig = require('startupjs/bundler').babelConfig

const noImportConversion = (importName, isBool) => {
  const headers = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6'])
  if (headers.has(importName)) return isBool ? true : '/Headers'
  return isBool ? false : `/${importName}`
}

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
        transform: importName => `@startupjs/ui/components${noImportConversion(importName)}`,
        skipDefaultConversion: importName => noImportConversion(importName, true),
        preventFullImport: true
      }
    }]
  ]

  return config
}

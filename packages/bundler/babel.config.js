// TODO: DEPRECATED!
// Use the 'startupjs/babel' preset directly in your project config.

const WARNING = `
WARNING!!! babel configuration from 'bundler' package is DEPRECATED!

Please change your babel.config.js to use 'startupjs/babel' preset and
pass alias options to it directly:

module.exports = {
  presets: [
    ['startupjs/babel', {
      legacyClassnames: true,
      alias: {}
    }]
  ]
}

`

module.exports = function (api, opts = {}) {
  console.error(WARNING)
  api.cache(true)
  return {
    presets: [['startupjs', opts]],
    plugins: []
  }
}

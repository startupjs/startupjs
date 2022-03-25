module.exports = function (api) {
  api.cache(true)

  return {
    presets: [
      ['startupjs/babel.cjs', {
        alias: {},
        observerCache: true
      }]
    ]
  }
}

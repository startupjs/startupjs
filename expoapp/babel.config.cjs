module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo', ['startupjs/babel', { docgen: true }]]
  }
}

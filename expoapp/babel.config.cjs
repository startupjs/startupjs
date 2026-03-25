module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      'babel-preset-expo',
      ['startupjs/babel', {
        // compileCssImports: true,
        // cssFileExtensions: ['cssx.styl', 'cssx.css']
      }]
    ]
  }
}

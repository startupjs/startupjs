exports.getJsxRule = () => ({
  test: /\.[jtmc]sx?$/,
  loader: 'babel-loader',
  options: {
    babelrc: false,
    configFile: './babel.config.js'
  }
})

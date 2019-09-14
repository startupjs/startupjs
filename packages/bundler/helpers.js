exports.getJsxRule = () => ({
  test: /\.jsx?$/,
  loader: 'babel-loader',
  options: {
    babelrc: false,
    configFile: './babel.config.js'
  }
})
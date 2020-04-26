exports.getJsxRule = () => ({
  test: /\.[jt]sx?$/,
  loader: 'babel-loader',
  options: {
    babelrc: false,
    configFile: './babel.config.js'
  }
})

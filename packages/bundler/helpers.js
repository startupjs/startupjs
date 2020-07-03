exports.getJsxRule = () => ({
  test: /\.[mc]?[jt]sx?$/,
  loader: 'babel-loader',
  options: {
    babelrc: false,
    configFile: './babel.config.cjs'
  }
})

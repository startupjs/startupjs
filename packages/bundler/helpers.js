exports.getJsxRule = () => ({
  test: /\.[mc]?[jt]sx?$/,
  loader: 'babel-loader'
})

const callLoader = require('./lib/callLoader')
const mdxExamplesLoader = require('./lib/mdxExamplesLoader')
const mdxLoader = require('./lib/mdxLoader')

module.exports = {
  // TODO VITE figure out what this proxy is about
  test: (path, query) => {
    if (query && query['commonjs-proxy'] != null) return false
    return /\.mdx?$/.test(path)
  },
  transform: (code) => {
    code = callLoader(mdxExamplesLoader, code)
    code = callLoader(mdxLoader, code)
    return code
  },
  before: true
}

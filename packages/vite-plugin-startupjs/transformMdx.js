const callLoader = require('./lib/callLoader')
const mdxExamplesLoader = require('./lib/mdxExamplesLoader')
const mdxLoader = require('./lib/mdxLoader')

module.exports = {
  test: (path) => /\.mdx?$/.test(path),
  transform: (code) => {
    code = callLoader(mdxExamplesLoader, code)
    code = callLoader(mdxLoader, code)
    return code
  },
  before: true
}

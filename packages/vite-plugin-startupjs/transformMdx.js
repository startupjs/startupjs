const callLoader = require('@startupjs/bundler/lib/callLoader')
const mdxExamplesLoader = require('@startupjs/bundler/lib/mdxExamplesLoader')
const mdxLoader = require('@startupjs/bundler/lib/mdxLoader')

module.exports = {
  test: (path) => /\.mdx?$/.test(path),
  transform: (code) => {
    code = callLoader(mdxExamplesLoader, code)
    code = callLoader(mdxLoader, code)
    return code
  },
  before: true
}

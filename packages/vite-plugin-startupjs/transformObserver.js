const callLoader = require('@startupjs/bundler/lib/callLoader')
const replaceObserverLoader = require('@startupjs/bundler/lib/replaceObserverLoader')

module.exports = {
  test: (path) => /\.([jt]sx?|mdx?)$/.test(path),
  transform: (code, _, isBuild, path) => {
    if (/(?:@modules|react-sharedb-hooks)/.test(path)) return code
    code = callLoader(replaceObserverLoader, code)
    return code
  },
  before: true
}

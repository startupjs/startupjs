const vitePluginReact = require('vite-plugin-react')

const transformReactHmr = vitePluginReact.transforms && vitePluginReact.transforms[0]

if (!transformReactHmr) {
  throw Error('vite-plugin-react transform API changed! Please update startupjs.')
}

module.exports = {
  // TODO VITE figure out what this proxy is about
  test: (path, query) => {
    if (query && query['commonjs-proxy'] != null) return false
    return /\.mdx?$/.test(path)
  },
  transform: (code, ...args) => {
    code = transformReactHmr.transform(code, ...args)
    return code
  }
}

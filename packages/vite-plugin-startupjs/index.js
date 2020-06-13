const resolver = require('./resolver')
const transformMdx = require('./transformMdx')
const transformMdxHmr = require('./transformMdxHmr')
const transformStyl = require('./transformStyl')
const transformBabel = require('./transformBabel')
const { startupjsServerPlugin } = require('./serverPlugin')
// const { addBeforeTransforms } = require('./patches/patchBeforeTransforms')
const applyPatches = require('./patches')
const { include, exclude } = require('./includeExclude')

// HACK: Monkey patch various things in vite for the plugin to work.
// TODO: implement PR
applyPatches()

// HACK: Custom 'before' transforms implementation. Runs before esbuild
// TODO: implement PR
// addBeforeTransforms([transformBabel, transformMdx])

// TODO VITE move webpack-loaders out into a separate library and use them
// TODO VITE properly host /public folder at root
// TODO VITE fix vite compilation when .styl is empty (it doesn't show up in transform)
module.exports = {
  alias: {
    'react-native': 'react-native-web'
  },
  configureServer: startupjsServerPlugin,
  resolvers: [resolver],
  transforms: [transformStyl, transformMdxHmr, transformBabel, transformMdx],
  optimizeDeps: {
    include,
    exclude
  }
}

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
module.exports = {
  configureServer: startupjsServerPlugin,
  resolvers: [resolver],
  transforms: [transformMdx, transformBabel, transformStyl, transformMdxHmr],
  optimizeDeps: {
    include,
    exclude
  }
}

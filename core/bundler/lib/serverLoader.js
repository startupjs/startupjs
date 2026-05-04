// TODO: add support for source maps
const babel = require('@babel/core')
const { isStartupjsPluginEcosystemFile } = require('babel-preset-startupjs/utils')

module.exports = function serverLoader (source) {
  const filename = this.resourcePath

  // ensure that this loader is only used on plugins, startupjs.config.js
  // and loadStartupjsConfig.js files.
  if (!isStartupjsPluginEcosystemFile(filename)) return source

  const envs = this.query.envs
  if (!envs) throw Error("serverLoader: envs not provided (for example ['features', 'isomorphic', 'server'])")

  return babel.transformSync(source, {
    filename,
    babelrc: false,
    configFile: false,
    presets: [[require('babel-preset-startupjs/server'), {
      envs,
      useRequireContext: this.query.useRequireContext
    }]]
  }).code
}

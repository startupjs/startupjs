// NOTE: startupjs.config.cjs is used by the old bundler. This regex does not include it.
exports.CONFIG_FILENAME_REGEX = /(?:^|[\\/])startupjs\.config\.m?[jt]sx?$/
exports.PLUGIN_FILENAME_REGEX = /(?:^|[.\\/])plugin\.[mc]?[jt]sx?$/
exports.LOAD_CONFIG_FILENAME_REGEX = /(?:^|[\\/])loadStartupjsConfig\.m?[jt]sx?$/
exports.MODEL_FILENAME_REGEX = /(?:^|[.\\/])model[\\/].*\.[mc]?[jt]sx?$/
const STARTUPJS_FILE_CONTENT_REGEX = /['"]startupjs['"]/

exports.isStartupjsPluginEcosystemFile = filename => {
  return (
    exports.PLUGIN_FILENAME_REGEX.test(filename) ||
    exports.CONFIG_FILENAME_REGEX.test(filename) ||
    exports.LOAD_CONFIG_FILENAME_REGEX.test(filename)
  )
}

exports.isModelFile = (filename, code) => {
  return exports.MODEL_FILENAME_REGEX.test(filename) && STARTUPJS_FILE_CONTENT_REGEX.test(code)
}

exports.createStartupjsFileChecker = ({ clientOnly } = {}) => {
  return (filename, code) => {
    if (exports.isStartupjsPluginEcosystemFile(filename)) return true
    if (clientOnly) {
      if (code != null) {
        if (exports.isModelFile(filename, code)) return true
      } else {
        console.warn(
          '[babel-preset-startupjs] File\'s source code must be provided when clientOnly is true. ' +
          'Assuming false for isModelFile check. Filename:', filename
        )
      }
    }
    return false
  }
}

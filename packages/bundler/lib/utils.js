// NOTE: startupjs.config.cjs is used by the old bundler. This regex does not include it.
exports.CONFIG_FILENAME_REGEX = /(?:^|[\\/])startupjs\.config\.m?[jt]sx?$/
exports.PLUGIN_FILENAME_REGEX = /(?:^|[.\\/])plugin\.[mc]?[jt]sx?$/
exports.LOAD_CONFIG_FILENAME_REGEX = /(?:^|[\\/])loadStartupjsConfig\.m?[jt]sx?$/

exports.isStartupjsPluginEcosystemFile = filename => {
  return (
    exports.PLUGIN_FILENAME_REGEX.test(filename) ||
    exports.CONFIG_FILENAME_REGEX.test(filename) ||
    exports.LOAD_CONFIG_FILENAME_REGEX.test(filename)
  )
}

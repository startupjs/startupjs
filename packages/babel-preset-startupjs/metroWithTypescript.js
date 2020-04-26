// metro has a hardcoded config for typescript babel plugin options.
// Here we run the default metro preset and then find the typescript plugin and monkeypatch
// its options to add the required 'onlyRemoveTypeImports: true' option.
// Without this option pug-related and style imports are gonna get stripped by typescript.
const metroPreset = require('metro-react-native-babel-preset')

module.exports = (...args) => {
  return patchTypescriptOptions(metroPreset(...args))
}

function patchTypescriptOptions (config) {
  for (let override of config.overrides || []) {
    for (let plugin of override.plugins || []) {
      if (Array.isArray(plugin) && plugin[1] && plugin[1].isTSX != null) {
        plugin[1].onlyRemoveTypeImports = true
      }
    }
  }
  return config
}

// Plugins Manager API (used by the actual framework)
const fs = require('fs')
const path = require('path')
const resolve = require('resolve')

const ROOT = process.cwd()
const CONFIG_NAME = 'startupjs.config.cjs'

let cache

// In future we might want to get only configuration for specific environment:
// 'bundler' | 'client' | 'server' | 'isomorphic'
exports.getPluginConfigs = function () {
  if (cache) return cache

  cache = {}
  parsePackageJsonForConfigs(path.join(ROOT, 'package.json'))
  return cache
}

function parsePackageJsonForConfigs (packageJsonPath) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const packages = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {})
  ]
  for (const packageName of packages) {
    setModuleConfig(packageName)
  }
}

function setModuleConfig (packageName) {
  if (cache[packageName]) return

  const packagePath = resolveNodeModuleDir(ROOT, packageName)
  if (!packagePath) return
  const config = getConfig(path.join(packagePath, CONFIG_NAME))
  if (!config) return

  cache[packageName] = config

  // Traverse package dependencies and set config for them too.
  // This is needed, since this might be transitional dependencies so we won't get them
  // from the project's package.json file.
  parsePackageJsonForConfigs(path.join(packagePath, 'package.json'))
}

// In future we might want to preprocess file for a specific environment before requiring it.
// This can be achieved by:
// 1. require config to have `module.exports` which exports the object.
// 2. prohibit any dynamic keys in this object and prohibit splats.
// 3. when getting config for specific environment, we just remove any other keys from this object,
//    except of the ones which are related to this environment.
// 4. run dead-code elimination to get rid of anything which is related to other envs:
//    ref: https://github.com/imcuttle/babel-plugin-danger-remove-unused-import
//
// Alternative and the simplest solution would be to just have a separate config file for each environment:
// - startupjs.bundler.config.js
// - startupjs.server.config.js
// - startupjs.client.config.js
// - startupjs.isomorphic.config.js
// Or to have a whole folder .startupjs with configs
function getConfig (configPath) {
  if (!fs.existsSync(configPath)) return
  const config = require(configPath)
  if (!config) return
  if (!(
    config.type === 'module' ||
    // Old modules api used type: 'plugin' for modules, but it didn't have 'for'
    (config.type === 'plugin' && !config.for))
  ) return
  return config
}

// ref: react-native-community/cli
function resolveNodeModuleDir (root, packageName) {
  try {
    return path.dirname(
      resolve.sync(path.join(packageName, 'package.json'), {
        basedir: ROOT
      })
    )
  } catch (err) {
  }
}

// Plugins Manager API (used by the actual framework)
const fs = require('fs')
const fsPath = require('path')
const resolve = require('resolve')

const ROOT = process.cwd()
const CONFIG_NAME = 'startupjs.json'

const getPluginConfigFilename = env => `${env}.js`

const getParentEnvs = env => ['server', 'client'].includes(env) ? ['isomorphic'] : []

exports.getPackages = function (env) {
  if (!env) throw Error('You must pass the env')
  const packagePaths = getPackagePathsFromPackageJson(fsPath.join(ROOT, 'package.json'))
  return removeDuplicates(findPackages(packagePaths, env))
}

function removeDuplicates (packagesMeta) {
  const processed = {}
  const res = []
  for (const i of packagesMeta) {
    const key = JSON.stringify({ type: i.type, name: i.name, for: i.for })
    if (processed[key]) continue
    res.push(i)
    processed[key] = true
  }
  return res
}

// Parses list of folder paths and loads all modules/plugins found there
// (the ones which have CONFIG_NAME in the root)
function findPackages (packagePaths, env) {
  if (!Array.isArray(packagePaths)) throw Error('packagePaths is not an array. This should never happen.')
  if (!env) throw Error('You must pass the env')
  return packagePaths.map(i => parsePackage(i, env)).flat(Infinity)
}

function parsePackage (packagePath, env) {
  if (!env) throw Error('You must pass the env')
  const configPath = fsPath.join(packagePath, CONFIG_NAME)
  const config = getConfig(configPath)
  if (!config) return []

  const res = []

  if (config.type === 'module') {
    // Load module itself
    if (!config.name) throw Error(`Loading ${configPath}: 'name' is required`)
    res.push({
      type: 'module',
      name: config.name,
      configPaths: [configPath]
    })

    // Load explicitly defined dependencies
    if (config.imports) {
      const packagePaths = config.imports.map(path => {
        if (!/^\.\//.test(path)) {
          throw Error(`
            Loading ${configPath}: 'imports' only supports relative paths (starting with ./).
            If you need to load a global package or plugin just specify it in your package.json
          `)
        }
        return fsPath.join(packagePath, path)
      })
      res.push(findPackages(packagePaths, env))
    }

    // Traverse package.json dependencies.
    // This is needed, since this might be transitional dependencies so we won't get them
    // from the project's package.json file.
    const packageJsonPath = fsPath.join(packagePath, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const packagePaths = getPackagePathsFromPackageJson(packageJsonPath)
      res.push(findPackages(packagePaths, env))
    }
  } else if (config.type === 'plugin' && config.for) {
    // Load plugin itself
    if (!config.name) throw Error(`[loader] 'name' is required: ${configPath}`)
    const pluginConfigPaths = getPluginConfigPaths(packagePath, env)
    if (pluginConfigPaths && pluginConfigPaths.length > 0) {
      res.push({
        type: 'plugin',
        name: config.name,
        for: config.for,
        configPaths: pluginConfigPaths
      })
    }
  }

  return res
}

function getConfig (configPath) {
  if (!fs.existsSync(configPath)) return
  const config = require(configPath)
  if (!config) return
  if (!(
    config.type === 'module' ||
    // Old modules api used type: 'plugin' for modules, but it didn't have 'for'
    (config.type === 'plugin' && config.for))
  ) return
  return config
}

// ref: react-native-community/cli
function resolveNodeModuleDir (root, packageName) {
  try {
    return fsPath.dirname(
      resolve.sync(fsPath.join(packageName, 'package.json'), {
        basedir: ROOT
      })
    )
  } catch (err) {
  }
}

function getPackagePathsFromPackageJson (packageJsonPath) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const packages = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {})
  ]
  const res = []
  for (const packageName of packages) {
    const packagePath = resolveNodeModuleDir(ROOT, packageName)
    if (!packagePath) continue
    res.push(packagePath)
  }
  return res
}

function getPluginConfigPaths (packagePath, env) {
  // exit if the actual env config does not exist
  if (!fs.existsSync(fsPath.join(packagePath, getPluginConfigFilename(env)))) return
  const envs = getParentEnvs(env).concat([env])
  return envs.map(env => {
    const configPath = fsPath.join(packagePath, getPluginConfigFilename(env))
    if (fs.existsSync(configPath)) return configPath
  }).filter(Boolean)
}

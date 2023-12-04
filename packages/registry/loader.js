// Plugins Manager API
// used by the actual framework to find all modules and plugins for them
import fs from 'fs'
import fsPath from 'path'
import resolve from 'resolve'

const ROOT = process.cwd()
const METADATA_FILENAME = 'startupjs.json'

const getParentEnvs = env => {
  switch (env) {
    case 'server': return ['isomorphic']
    case 'client': return ['isomorphic']
    default: return []
  }
}

export function getPackages (env, root = ROOT) {
  if (!env) throw Error('You must pass the env')
  const packagePaths = getPackagePathsFromPackageJson(root, fsPath.join(root, 'package.json'))
  return removeDuplicates(findPackages(root, packagePaths, env))
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
// (the ones which have METADATA_FILENAME in the root)
function findPackages (root, packagePaths, env) {
  if (!Array.isArray(packagePaths)) throw Error('packagePaths is not an array. This should never happen.')
  if (!env) throw Error('You must pass the env')
  return packagePaths.map(i => parsePackage(root, i, env)).flat(Infinity)
}

function parsePackage (root, packagePath, env) {
  if (!env) throw Error('You must pass the env')
  const metaPath = fsPath.join(packagePath, METADATA_FILENAME)
  const meta = getMeta(metaPath)
  if (!meta) return []

  const res = []

  if (meta.type === 'module') {
    // Load module itself
    if (!meta.name) throw Error(`Loading ${metaPath}: 'name' is required`)
    res.push({
      type: 'module',
      name: meta.name,
      meta
    })

    // Load explicitly defined dependencies
    if (meta.imports) {
      const packagePaths = meta.imports.map(path => {
        if (!/^\.\//.test(path)) {
          throw Error(`
            Loading ${metaPath}: 'imports' only supports relative paths (starting with ./).
            If you need to load a global package or plugin just specify it in your package.json
          `)
        }
        return fsPath.join(packagePath, path)
      })
      const x = findPackages(root, packagePaths, env)
      res.push(x)
    }

    // Traverse package.json dependencies.
    // This is needed, since this might be transitional dependencies so we won't get them
    // from the project's package.json file.
    const packageJsonPath = fsPath.join(packagePath, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const packagePaths = getPackagePathsFromPackageJson(root, packageJsonPath)
      res.push(findPackages(root, packagePaths, env))
    }
  } else if (meta.type === 'plugin' && meta.for) {
    // Load plugin itself
    if (!meta.name) throw Error(`[loader] 'name' is required: ${metaPath}`)
    const pluginInits = getPluginInits(root, packagePath, meta.name, env)
    if (pluginInits.length > 0) {
      res.push({
        type: 'plugin',
        name: meta.name,
        for: meta.for,
        meta,
        inits: pluginInits
      })
    }
  }

  return res
}

function getMeta (metaPath) {
  if (!fs.existsSync(metaPath)) return
  const meta = require(metaPath)
  if (!meta) return
  if (!(
    meta.type === 'module' ||
    // Old modules api used type: 'plugin' for modules, but it didn't have 'for'
    (meta.type === 'plugin' && meta.for))
  ) return
  return meta
}

// ref: react-native-community/cli
function resolveNodeModuleDir (root, packageName) {
  try {
    return fsPath.dirname(
      resolve.sync(fsPath.join(packageName, 'package.json'), {
        basedir: root
      })
    )
  } catch (err) {
  }
}

function getPackagePathsFromPackageJson (root, packageJsonPath) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const packages = [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {})
  ]
  const res = []
  for (const packageName of packages) {
    const packagePath = resolveNodeModuleDir(root, packageName)
    if (!packagePath) continue
    res.push(packagePath)
  }
  return res
}

function getPluginInits (root, pluginPath, pluginName, env) {
  const envs = getParentEnvs(env).concat([env])
  return envs.map(env => {
    const initPath = resolvePluginInitPath(pluginPath, env)
    if (!initPath) return undefined
    const configPath = resolvePluginConfigPath(root, pluginName, env)
    return {
      env,
      init: initPath,
      config: configPath || {}
    }
  }).filter(Boolean)
}

// TODO: This resolution is very inefficient because of checking multiple extensions.
//       It needs to be rewritten to read the whole tree structure once and then just
//       checking for the files existence.
function resolvePluginInitPath (pluginPath, env) {
  for (const testPath of getPluginInitFilenames(env)) {
    const fullPath = fsPath.join(pluginPath, testPath)
    if (fs.existsSync(fullPath)) return fullPath
  }
}

// TODO: This resolution is very inefficient because of checking multiple extensions.
//       It needs to be rewritten to read the whole tree structure once and then just
//       checking for the files existence.
function resolvePluginConfigPath (root, pluginName, env) {
  for (const testPath of getPluginConfigFilenames(pluginName, env)) {
    const fullPath = fsPath.join(root, 'startupjs.config', testPath)
    if (fs.existsSync(fullPath)) return fullPath
  }
}

const extensions = [
  '.js'
  // TODO: Support this extensions too. This will need a more efficient rewrite
  //       for checking for file existence instead of the default sync checking.
  // '.tsx', '.ts', '.jsx', '.cjs', '.mjs',
]

const getPluginInitFilenames = env => [
  ...extensions.map(i => `${env}${i}`),
  ...extensions.map(i => `${env}/index${i}`)
]

const getPluginConfigFilenames = (pluginName, env) => [
  ...extensions.map(i => `${pluginName}.${env}${i}`),
  ...extensions.map(i => `${pluginName}/${env}${i}`),
  ...extensions.map(i => `${pluginName}/${env}/index${i}`)
]

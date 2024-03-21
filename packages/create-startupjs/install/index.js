import { $ } from 'execa'
import { join, dirname } from 'path'
import { existsSync, readFileSync, writeFileSync, renameSync } from 'fs'
import url from 'url'
import isEqual from 'lodash/isEqual.js'
import chalk from 'chalk'
import { diffString } from 'json-diff'

const __dirname = dirname(url.fileURLToPath(import.meta.url))
const PROJECT_JSON_PATH = join(process.cwd(), 'package.json')
const MODULE_PATH = join(__dirname, '..')
const CLI_JSON_PATH = join(__dirname, '../package.json')
const INIT_JSON_PATH = join(__dirname, './init/package.json')
const INIT_METRO_CONFIG_PATH = join(__dirname, './init/metro.config.cjs')
const INIT_GITIGNORE_PATH = join(__dirname, './init/gitignore')
const INIT_STARTUPJS_CONFIG_PATH = join(__dirname, './init/startupjs.config.js')
const DEVELOPMENT_JSON_PATH = join(__dirname, './dev/package.json')
const UI_JSON_PATH = join(__dirname, './ui/package.json')
const UI_EXPO_JSON_PATH = join(__dirname, './ui-expo/package.json')
const ROUTER_JSON_PATH = join(__dirname, './router/package.json')

const GITIGNORE_MARKER = '@generated startupjs'

export const name = 'install'
export const description = 'Install startupjs into an existing project.'
export const options = [{
  name: '--all',
  description: `
    Add startupjs and everything else too.
    This combines --init, --dev, --ui, --fix together.
    This is the default option if no other options are passed.
    This can be safely used multiple times - it will only add missing things and update outdated things.
  `
}, {
  name: '--init',
  description: `
    Add startupjs and its runtime to your project.
    This will:
      - add \`startupjs\` to your dependencies
      - set \`"type": "module"\` in your package.json
      - add \`build\` and \`start-production\` scripts to your package.json
      - append startupjs-specific things to your \`.gitignore\`
      - add startupjs-specific \`metro.config.cjs\`
      - add \`startupjs.config.js\` with server enabled
  `
}, {
  name: '--dev',
  description: `
    Add development dependencies and configure them.
    This will:
      - install eslint and configure it (will add "eslintConfig" to package.json)
      - install and configure pre-commit hooks for ts/js files ("husky" and "lint-staged")
  `
}, {
  name: '--ui',
  description: 'Add @startupjs/ui and its required peer dependencies.'
}, {
  name: '--router',
  description: 'Add @startupjs/router and its required peer dependencies.'
}, {
  name: '--fix',
  description: 'Automatically update any invalid package versions used by startupjs'
}, {
  name: '--skip-install',
  description: 'Skip running the package manager install command after modifying the package.json'
}]

export async function action ({ skipInstall, ...options } = {}) {
  let { fix, dev, ui, init, router, all } = options
  // if no options are passed, assume --all
  if (Object.keys(options).length === 0) all = true
  if (all) {
    dev = true
    ui = true
    router = true
    init = true
  }
  if (fix || dev || ui || init || router) {
    return await runInstall({
      setupDevelopment: dev,
      setupUi: ui,
      setupRouter: router,
      setupInit: init,
      isSetup: dev || ui || init,
      skipInstall
    })
  }
  throw exitWithError('You must pass one of the options. Run `npx startupjs install --help` for more information.')
}

async function runInstall ({ setupDevelopment, setupUi, setupRouter, setupInit, isSetup, skipInstall } = {}) {
  if (!existsSync(PROJECT_JSON_PATH)) throw exitWithError(ERRORS.noPackageJson)
  const packageJson = JSON.parse(readFileSync(PROJECT_JSON_PATH, 'utf8'))
  let startupjsVersion = packageJson?.dependencies?.startupjs
  if (!startupjsVersion) {
    if (setupInit) {
      startupjsVersion = JSON.parse(readFileSync(CLI_JSON_PATH, 'utf8')).version
    } else {
      throw exitWithError(ERRORS.noStartupjsDependency)
    }
  }

  // we need to use the minor.0 version since @startupjs/ui might not have the exact version
  // as the startupjs package
  const STARTUPJS_MINOR_ZERO = startupjsVersion.replace(/\.\d+$/, '.0').replace(/^[^\d]*/, '')

  const templates = []

  // always add this template since it's the base and has the 'startupjs' dependency itself
  templates.push(JSON.parse(fromTemplateFile(INIT_JSON_PATH)))

  if (setupDevelopment || packageJson.devDependencies?.['eslint-config-startupjs']) {
    templates.push(JSON.parse(fromTemplateFile(DEVELOPMENT_JSON_PATH)))
  }

  if (setupUi || packageJson.dependencies['@startupjs/ui']) {
    templates.push(JSON.parse(fromTemplateFile(UI_JSON_PATH)))
    if (packageJson.dependencies.expo) {
      templates.push(JSON.parse(fromTemplateFile(UI_EXPO_JSON_PATH)))
    }
  }

  if (setupRouter || packageJson.dependencies['@startupjs/router']) {
    templates.push(JSON.parse(fromTemplateFile(ROUTER_JSON_PATH)))
  }

  // warnings and instructions for the user which will be printed at the very end
  const finalLog = []
  const triggerModified = createTrigger()
  const triggerPackageJsonModified = createTrigger(triggerModified)

  let hasDiff
  for (const template of templates) {
    for (const key in template) {
      if (isDependencies(key)) {
        await processPackageJsonDependencies({
          key, template, packageJson, triggerModified: triggerPackageJsonModified, STARTUPJS_MINOR_ZERO
        })
      } else if (isSetup) {
        processPackageJsonMeta({
          key,
          template,
          packageJson,
          triggerModified: triggerPackageJsonModified,
          onDiff: diff => {
            if (!hasDiff) finalLog.push(chalk.yellow(ERRORS.differenceInPackageJson))
            hasDiff = true
            finalLog.push(diff)
          }
        })
      }
    }
  }

  // write the updated package.json back to the file
  if (triggerPackageJsonModified.wasTriggered()) {
    writeFileSync(PROJECT_JSON_PATH, JSON.stringify(packageJson, null, 2))
  }

  if (setupInit) {
    maybeAppendGitignore({ triggerModified })
    maybeRenameMetroConfig({ triggerModified })
    maybeCopyMetroConfig({ triggerModified, onLog: log => finalLog.push(log) })
    maybeCopyStartupjsConfig({ triggerModified })
    maybeRenameBabelConfig({ triggerModified })
  }

  try {
    if (triggerPackageJsonModified.wasTriggered() && !skipInstall) {
      // run package manager install command to actually update the packages
      const { exitCode } = await $({ stdio: 'inherit' })`\
        ${getPackageManager()} install \
      `
      if (exitCode && exitCode !== 0 && exitCode !== '0') {
        throw Error(`Exit code: ${exitCode}`)
      }
    }
  } catch (error) {
    console.log(chalk.red(`\nError running package manager install command:\n${error.message || error}`))
    finalLog.push(chalk.red('There was an error running package manager install command. Please run it manually.'))
  } finally {
    if (finalLog.length > 0) {
      console.log('\n' + finalLog.join('\n'))
    } else if (triggerModified.wasTriggered()) {
      console.log(chalk.green('Done successfully.'), chalk.yellow('Please add and commit changes!'))
    } else {
      console.log(chalk.green('Nothing to do. Everything is already set up as expected.'))
    }
  }
}

function isDependencies (key) {
  return ['dependencies', 'devDependencies'].includes(key)
}

async function processPackageJsonDependencies ({
  key, template, packageJson, triggerModified, STARTUPJS_MINOR_ZERO
}) {
  // always overwrite dependencies with the correct versions
  for (const dependencyName in template[key]) {
    if (!packageJson[key]) packageJson[key] = {}
    const version = await transformDependencyVersion({
      name: dependencyName, version: template[key][dependencyName], STARTUPJS_MINOR_ZERO
    })
    if (packageJson[key][dependencyName] !== version) {
      packageJson[key][dependencyName] = version
      triggerModified?.()
    }
  }
}

function processPackageJsonMeta ({ key, template, packageJson, onDiff, triggerModified }) {
  // only add scripts which don't already exist
  let isDifferent
  if (typeof template[key] === 'object') {
    for (const item in template[key]) {
      if (packageJson[key]?.[item]) {
        // if the item already exists, check if it's different
        if (!isEqual(packageJson[key][item], template[key][item])) isDifferent = true
      } else {
        if (!packageJson[key]) packageJson[key] = {}
        if (packageJson[key][item] !== template[key][item]) {
          packageJson[key][item] = template[key][item]
          triggerModified?.()
        }
      }
    }
  } else {
    if (packageJson[key]) {
      if (!isEqual(packageJson[key], template[key])) isDifferent = true
    } else {
      packageJson[key] = template[key]
      triggerModified?.()
    }
  }
  if (isDifferent) {
    onDiff?.(diffString({ [key]: packageJson[key] }, { [key]: template[key] }))
  }
}

// some of the values in the template might be templatized
function fromTemplateFile (filename, vars = {}) {
  let template = readFileSync(filename, 'utf8')
  for (const theVar in vars) {
    template = template.replace(new RegExp(`%%${theVar}%%`, 'g'), vars[theVar])
  }
  return template
}

// dynamically find the correct version for the dependency if it's templatized
async function transformDependencyVersion ({ name, version, STARTUPJS_MINOR_ZERO } = {}) {
  const match = version.match(/%%([^%]+)%%/)
  if (match) {
    const theVar = match[1]
    if (theVar === 'STARTUPJS_MINOR_LATEST') {
      if (!STARTUPJS_MINOR_ZERO) throw Error('STARTUPJS_MINOR_ZERO is required to find STARTUPJS_MINOR_LATEST')
      const semver = version.replace(match[0], STARTUPJS_MINOR_ZERO)
      const latestMatchingVersion = await getLatestMatchingVersion(name, semver)
      return version.replace(match[0], latestMatchingVersion)
    } else {
      throw Error(`Unknown variable for ${name}: ${match[0]}`)
    }
  }
  return version
}

async function getLatestMatchingVersion (name, semver) {
  const { stdout } = await $`npm show ${name}@${semver} version --json`
  let versions
  try {
    versions = JSON.parse(stdout)
  } catch (error) {
    throw Error(`Error parsing versions for ${name} of ${semver}. No versions returned. Got: \`${stdout}\``)
  }
  if (!(Array.isArray(versions) && versions.length > 0)) {
    throw Error(`No satisfying versions found for ${name} of ${semver}`)
  }
  return versions.pop()
}

function maybeAppendGitignore ({ triggerModified }) {
  const gitignorePath = join(process.cwd(), '.gitignore')
  let gitignore = existsSync(gitignorePath) ? readFileSync(gitignorePath, 'utf8') : ''
  if (gitignore.includes(GITIGNORE_MARKER)) return
  gitignore += '\n' + readFileSync(INIT_GITIGNORE_PATH, 'utf8')
  writeFileSync(gitignorePath, gitignore)
  triggerModified?.()
}

function maybeCopyMetroConfig ({ onLog, triggerModified }) {
  const metroConfigPath = join(process.cwd(), 'metro.config.cjs')
  if (existsSync(metroConfigPath)) {
    const metroConfig = readFileSync(metroConfigPath, 'utf8')
    if (!metroConfig.includes('startupjs/metro-config')) {
      onLog?.(chalk.yellow(`
        WARNING! Your existing \`metro.config.cjs\` is not using 'startupjs/metro-config'.
        Please update your \`metro.config.cjs\` manually based on the following template:
        \n\`\`\`js\n${readFileSync(INIT_METRO_CONFIG_PATH, 'utf8')}\`\`\`
      `))
    }
    return
  }
  writeFileSync(metroConfigPath, readFileSync(INIT_METRO_CONFIG_PATH, 'utf8'))
  triggerModified?.()
}

function maybeCopyStartupjsConfig ({ triggerModified }) {
  const startupjsConfigPath = join(process.cwd(), 'startupjs.config.js')
  if (existsSync(startupjsConfigPath)) return
  writeFileSync(startupjsConfigPath, readFileSync(INIT_STARTUPJS_CONFIG_PATH, 'utf8'))
  triggerModified?.()
}

// we are using ESM, so if babel config is using module.exports, we need to rename it to .cjs
function maybeRenameBabelConfig ({ triggerModified }) {
  const babelConfigPath = join(process.cwd(), 'babel.config.js')
  if (!existsSync(babelConfigPath)) return
  const babelConfig = readFileSync(babelConfigPath, 'utf8')
  if (!babelConfig.includes('module.exports')) return
  renameSync(babelConfigPath, join(process.cwd(), 'babel.config.cjs'))
  triggerModified?.()
}

// we are using ESM, so if metro config is using module.exports, we need to rename it to .cjs
function maybeRenameMetroConfig ({ triggerModified }) {
  const metroConfigPath = join(process.cwd(), 'metro.config.js')
  if (!existsSync(metroConfigPath)) return
  const metroConfig = readFileSync(metroConfigPath, 'utf8')
  if (!metroConfig.includes('module.exports')) return
  renameSync(metroConfigPath, join(process.cwd(), 'metro.config.cjs'))
  triggerModified?.()
}

function getPackageManager () {
  // check multiple possible project roots.
  // (in a monorepo environment it might be run from a subdirectory)
  const possibleRoots = [process.cwd()]
  // naive check for monorepo root.
  // Assumes that the current package (create-startupjs)
  // is in the monorepo root's node_modules/create-startupjs
  // Coincidentally this also matches startupjs monorepo structure of packages/create-startupjs
  const possibleMonorepoRoot = join(MODULE_PATH, '../..')
  if (possibleMonorepoRoot !== process.cwd()) possibleRoots.push(possibleMonorepoRoot)
  for (const possibleRoot of possibleRoots) {
    const packageJsonPath = join(possibleRoot, 'package.json')
    const packageJson = existsSync(packageJsonPath) ? JSON.parse(readFileSync(packageJsonPath, 'utf8')) : {}
    if (
      existsSync(join(process.cwd(), 'yarn.lock')) ||
      existsSync(join(process.cwd(), '.yarn')) ||
      /^yarn/.test(packageJson.packageManager)
    ) return 'yarn'
    if (existsSync(join(process.cwd(), 'package-lock.json'))) return 'npm'
  }
  return 'npm'
}

function exitWithError (error) {
  console.error(chalk.red(error))
  process.exit(1)
  // For the readability sake we return an error even though we already exited.
  // This is just to make the linters and static code analysis tools happy.
  return Error(error)
}

const ERRORS = {
  noPackageJson: `
    No package.json found in current directory.
    You must run this command in the root of your project.
  `,
  noStartupjsDependency: `
    No startupjs dependency found in your package.json.
    You must run this command in the root of your project and
    you must have startupjs already installed to run this command.
  `,
  differenceInPackageJson: `
    WARNING!
    The following items in your package.json are different from what is suggested by the startupjs.
    Please review the differences and update your package.json manually:
  `
}

function createTrigger (onTriggered) {
  let triggered = false
  function trigger () {
    triggered = true
    onTriggered?.()
  }
  trigger.wasTriggered = () => triggered
  return trigger
}

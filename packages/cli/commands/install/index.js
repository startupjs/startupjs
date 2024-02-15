import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import url from 'url'
import isEqual from 'lodash/isEqual.js'
import chalk from 'chalk'
import { diffString } from 'json-diff'

const __filename = url.fileURLToPath(import.meta.url)
const PACKAGE_JSON_PATH = join(process.cwd(), 'package.json')
const DEVELOPMENT_JSON_PATH = join(__filename, './packageJsonTemplates/development.json')
const UI_JSON_PATH = join(__filename, './packageJsonTemplates/ui.json')

export const name = 'install'
export const description = 'Start production node server with production web build'
export const options = [{
  name: '--fix',
  description: 'Automatically update any invalid package versions used by startupjs'
}]

export async function action ({ fix } = {}) {
  if (fix) return await fixDependencies()
  exitWithError('Only --fix option is supported for now.')
}

async function fixDependencies () {
  const packageJsonPath = PACKAGE_JSON_PATH
  if (!existsSync(packageJsonPath)) exitWithError(ERRORS.noPackageJson)
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  const startupjsVersion = packageJson?.dependencies?.startupjs
  if (!startupjsVersion) exitWithError(ERRORS.noStartupjsDependency)

  // we need to use the minor.0 version since @startupjs/ui might not have the exact version
  // as the startupjs package
  const STARTUPJS_MINOR_VERSION = startupjsVersion.replace(/\.\d+$/, '.0')

  const jsonTemplates = []

  jsonTemplates.push(JSON.parse(fromTemplateFile(DEVELOPMENT_JSON_PATH, { STARTUPJS_MINOR_VERSION })))

  if (packageJson.dependencies['@startupjs/ui']) {
    jsonTemplates.push(JSON.parse(fromTemplateFile(UI_JSON_PATH, { STARTUPJS_MINOR_VERSION })))
  }

  const differences = []
  for (const jsonTemplate of jsonTemplates) {
    for (const key in jsonTemplate) {
      if (['dependencies', 'devDependencies'].includes(key)) {
        // always overwrite dependencies with the correct versions
        for (const item in jsonTemplate[key]) {
          packageJson[key][item] = jsonTemplate[key][item]
        }
      } else {
        // only add other package.json things (like scripts) if they don't already exist.
        let isDifferent
        for (const item in jsonTemplate[key]) {
          if (packageJson[key][item]) {
            // if the item already exists, check if it's different
            if (!isEqual(packageJson[key][item], jsonTemplate[key][item])) isDifferent ??= true
          } else {
            packageJson[key][item] = jsonTemplate[key][item]
          }
        }
        if (isDifferent) {
          differences.push(diffString({ [key]: packageJson[key] }, { [key]: jsonTemplate[key] }))
        }
      }
    }
  }

  // write the updated package.json back to the file
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  // run package manager install command to actually update the packages
  packageManagerInstall()

  // if there were any differences which we couldn't resolve, print them out
  // and let the user decide what to do on his own
  if (differences.length > 0) {
    console.log(chalk.yellow(ERRORS.differenceInPackageJson))
    console.log('\n' + differences.join('\n'))
  }
}

function fromTemplateFile (filename, vars) {
  let template = readFileSync(join(filename, DEVELOPMENT_JSON_PATH), 'utf8')
  for (const theVar in vars) {
    template = template.replace(new RegExp(`%%${theVar}%%`, 'g'), vars[theVar])
  }
  return template
}

function packageManagerInstall () {
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'))
  if (
    existsSync(join(process.cwd(), 'yarn.lock')) ||
    existsSync(join(process.cwd(), '.yarn')) ||
    packageJson.packageManager?.test(/^yarn/)
  ) return 'yarn install'
  if (existsSync(join(process.cwd(), 'package-lock.json'))) return 'npm install'
  return 'npm install'
}

function exitWithError (error) {
  console.error(chalk.red(error))
  process.exit(1)
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

import chalk from 'chalk'
import { program } from 'commander'
import { $ as execa } from 'execa'
import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'
import semver from 'semver'
import getTemplate from './getTemplate.js'
import PackageManger from './PackageManager.js'
import spinner from './spinner.js'

const DEFAULT_TEMPLATE = 'blank'
const MIN_NODE_VERSION = '21.2.0'
const $ = execa({ shell: true })

program
  .usage('[projectName]')
  .description('Bootstrap a new StartupJS application.')
  .arguments('[projectName]')
  .option('-t, --template <name>', 'Which startupjs template to use to bootstrap the project', DEFAULT_TEMPLATE)
  .action(create)

async function create (
  projectName,
  { template: templateName }
) {
  // Checking if project name was provided.
  // If not, prompt the user to provide one.
  if (!projectName) {
    const { name } = await inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'How would you like to name the app?',
      validate: (str) => {
        if (str) return true
        return 'You must provide a name for your app!'
      }
    }])

    projectName = name
  }

  // Checking if current Node.js version is less
  // than the minimum required version.
  const nodeVersion = process.version

  if (semver.lt(nodeVersion, MIN_NODE_VERSION)) {
    console.error(
      `${chalk.red(
        `StartupJS needs Node.js ${MIN_NODE_VERSION}. ` +
        `You're currently on version ${nodeVersion}. ` +
        'Please upgrade Node.js to a supported version and try again.'
      )}`
    )
    process.exit(1)
  }

  // Initiating prompt for user to select a package manager.
  const { packageManager: pkgManager } = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager would you like to use?',
      choices: ['npm', 'yarn'],
      default: 'npm'
    }
  ])

  // Creating an instance of PackageManager class based on user's choice
  // This instance will be used to perform operations further in our program.
  let packageManager
  const projectPath = path.join(process.cwd(), projectName)
  const $project = $({ cwd: projectPath })

  try {
    packageManager = await new PackageManger(pkgManager, projectPath)
  } catch (e) {
    console.log(`${chalk.red(e.message)}`)
    process.exit(1)
  }

  const {
    path: templatePath,
    dependencies,
    devDependencies,
    expoDependencies,
    removeDependencies,
    removeFiles
  } = getTemplate(templateName)

  // Generating new app
  const generatingNewAppPromise = (async () => {
    // Generating a new Expo app
    await $`npx create-expo-app ${projectName} --no-install -t blank`
    // Copying template files to project directory.
    await recursivelyCopyFiles(templatePath, projectPath)
    // Completing the configuration of package manager
    await packageManager.complete()
  })()

  await spinner(
    'Generating a new app',
    generatingNewAppPromise
  )

  // Settings up the application
  const settingsUpApp = (async () => {
    // Removing extra files which are covered by startupjs core.
    if (removeFiles.length) await $project`rm -f ${removeFiles}`
    // Updating dependencies.
    if (removeDependencies.length) await packageManager.uninstall(removeDependencies)
    if (dependencies.length) await packageManager.install(dependencies)
    if (devDependencies.length) await packageManager.installDev(devDependencies)
    if (expoDependencies.length) await $project`expo install ${expoDependencies}`

    // Patching app.json
    patchAppJSON(projectPath)
    // Patching package.json
    patchPackageJSON(projectPath)
    // Patching .gitignore
    patchGitignore(projectPath)
  })()

  await spinner(
    'Settings up the application and updating dependencies',
    settingsUpApp
  )

  printInstructions(pkgManager)
}

async function recursivelyCopyFiles (sourcePath, targetPath) {
  if (!fs.existsSync(targetPath)) {
    await $`mkdir -p ${targetPath}`
  }

  const fileNames = fs.readdirSync(sourcePath)

  for (const fileName of fileNames) {
    const filePath = path.join(sourcePath, fileName)

    if (fs.lstatSync(filePath).isDirectory()) {
      await recursivelyCopyFiles(filePath, path.join(targetPath, fileName))
    } else {
      await $`cp ${filePath} ${targetPath}`
    }
  }
}

function patchAppJSON (projectPath) {
  const appJSONPath = path.join(projectPath, 'app.json')
  const appJSON = JSON.parse(fs.readFileSync(appJSONPath).toString())

  appJSON.expo.web.bundler = 'metro'

  fs.writeFileSync(
    appJSONPath,
    `${JSON.stringify(appJSON, null, 2)}\n`
  )
}

function patchPackageJSON (appPath) {
  const packageJSONPath = path.join(appPath, 'package.json')
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString())

  delete packageJSON.main

  // TODO add scripts
  // packageJSON.scripts = {
  //   ...packageJSON.scripts,
  //   ...SCRIPTS
  // }

  // TODO install latest version (add to dependencies in getTemplate.js)
  // packageJSON['lint-staged'] = {
  //   '*.{js,jsx}': [
  //     'eslint --fix',
  //     'git add'
  //   ]
  // }

  // TODO Install latest husky (add to dependencies in getTemplate.js)
  // add script to package json
  // and then run - npx husky install - to setup the hook
  // packageJSON.husky = {
  //   hooks: {
  //     'pre-commit': 'lint-staged'
  //   }
  // }

  fs.writeFileSync(
    packageJSONPath,
    `${JSON.stringify(packageJSON, null, 2)}\n`
  )
}

function patchGitignore (projectPath) {
  const gitignorePath = path.join(projectPath, '.gitignore')
  let gitignore = fs.readFileSync(gitignorePath).toString()

  gitignore += `
    # DB data
    /data/
    # Protection from accidentally commiting private npm keys to a public repo
    .npmrc
    # Mongo data when running in a docker dev container
    /.mongo
    # yarn
    .yarn/
    # sqlite
    /local.db
  `.replace(/\n\s+/g, '\n')

  fs.writeFileSync(gitignorePath, gitignore)
}

function printInstructions (packageManager) {
  const commands = {
    npm: 'npm run',
    yarn: 'yarn'
  }
  const command = commands[packageManager]

  return `
    ✅ Your project is ready!

    To run your project, navigate to the directory and run each command in a separate terminal tab:

    - $ ${command} server
    - $ ${command} start
  `
}

program.parse(process.argv)

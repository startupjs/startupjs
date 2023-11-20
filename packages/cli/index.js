const commander = require('commander')
const execa = require('execa')
const path = require('path')
const fs = require('fs')
const template = require('lodash/template')
const CLI_VERSION = require('./package.json').version

const IS_PRERELEASE = /(?:alpha|canary)/.test(CLI_VERSION)
const STARTUPJS_VERSION = IS_PRERELEASE ? `^${CLI_VERSION.replace(/\.\d+$/, '.0')}` : 'latest'

let PATCHES_DIR
try {
  PATCHES_DIR = path.join(
    path.dirname(require.resolve('@startupjs/patches')),
    'patches'
  )
  // patch-package requires the path to be relative
  PATCHES_DIR = path.relative(process.cwd(), PATCHES_DIR)
} catch (err) {
  console.error(err)
  console.error('ERROR!!! Patches packages not found. Falling back to local patches folder')
  PATCHES_DIR = './patches'
}

let PM_SCRIPTS_PATH
try {
  PM_SCRIPTS_PATH = path.join(
    path.dirname(require.resolve('@startupjs/pm')),
    'scripts.sh'
  )
} catch (err) {
  console.error(err)
  console.error('ERROR!!! @startupjs/pm package wasn\'t found.')
}

let PATCHES_GESTURE_HANDLER_DIR
try {
  PATCHES_GESTURE_HANDLER_DIR = path.join(
    path.dirname(require.resolve('@startupjs/patches')),
    'patches_gestureHandler'
  )
  // patch-package requires the path to be relative
  PATCHES_GESTURE_HANDLER_DIR = path.relative(process.cwd(), PATCHES_GESTURE_HANDLER_DIR)
} catch (err) {
  console.error(err)
  console.error('ERROR!!! Gesture handler patches not found.')
}

const LINK = !!process.env.LINK
const LOCAL_DIR = process.env.LOCAL_DIR || '.'

const DEPENDENCIES = [
  // Install alpha version of startupjs when running the alpha of cli
  `startupjs@${STARTUPJS_VERSION}`,
  'react-native-svg@^12.1.0',
  'nconf@^0.10.0',
  'react',
  'react-dom',
  'axios@^0.26.0' // For making AJAX requests
]

const DEV_DEPENDENCIES = [
  '@babel/eslint-parser',
  'eslint@latest',
  'eslint-config-standard',
  'eslint-config-standard-react',
  'eslint-plugin-import',
  'eslint-plugin-import-helpers',
  'eslint-plugin-n',
  'eslint-plugin-promise',
  'eslint-plugin-react',
  'eslint-plugin-react-pug',
  'eslint-plugin-react-hooks',
  'eslint-plugin-standard',
  'husky@^4.3.0',
  'lint-staged'
]

const REMOVE_DEPENDENCIES = [
  '@babel/core',
  '@babel/runtime',
  '@react-native/eslint-config',
  'metro-react-native-babel-preset'
]

const REMOVE_FILES = [
  '.prettierrc.js',
  '.eslintrc.js',
  '.flowconfig',
  'App.js',
  'babel.config.js',
  'metro.config.js'
]

const SCRIPTS_ORIG = {}

// Development

SCRIPTS_ORIG.start = ({ inspect } = {}) => oneLine(`
  npx concurrently
    "${SCRIPTS_ORIG.web}"
    "${SCRIPTS_ORIG.server({ inspect })}"
`)

// Web

SCRIPTS_ORIG.web = oneLine(`
  npx cross-env WEBPACK_DEV=1
  npx webpack-dev-server --config webpack.web.config.js
`)

// Server

SCRIPTS_ORIG.server = ({ inspect } = {}) => oneLine(`
  node
    ${inspect ? '--inspect' : ''}
    --watch
    server.js
`)

// Production

SCRIPTS_ORIG.build = ({ async } = {}) => oneLine(`
  npx rimraf ./build &&
  ${async ? 'npx cross-env ASYNC=1' : ''}
  npx webpack --config webpack.web.config.js
`)

SCRIPTS_ORIG.startProduction = oneLine(`
  npx cross-env NODE_ENV=production
  node server.js
`)

// Etc

SCRIPTS_ORIG.patchPackage = () => oneLine(`
  npx patch-package --patch-dir ${PATCHES_DIR} && ${SCRIPTS_ORIG.patchGestureHandler()}
`)

SCRIPTS_ORIG.patchGestureHandler = () => PATCHES_GESTURE_HANDLER_DIR
  ? oneLine(`
      (cat package.json | grep -q react-native-gesture-handler && npx patch-package --patch-dir ${PATCHES_GESTURE_HANDLER_DIR} || true)
    `)
  : 'true'

SCRIPTS_ORIG.postinstall = () => oneLine(`
  ${SCRIPTS_ORIG.patchPackage()}}
`)

const SCRIPTS = {
  start: 'startupjs start',
  metro: 'react-native start --reset-cache',
  web: 'startupjs web',
  server: 'startupjs server',
  postinstall: 'startupjs postinstall',
  adb: 'adb reverse tcp:8081 tcp:8081 && adb reverse tcp:3000 tcp:3000 && adb reverse tcp:3010 tcp:3010',
  'log-android-color': 'react-native log-android | ccze -m ansi -C -o nolookups',
  'log-android': 'hash ccze 2>/dev/null && npm run log-android-color || (echo "WARNING! Falling back to plain logging. For colored logs install ccze - brew install ccze" && react-native log-android)',
  android: 'react-native run-android && (npm run adb || true) && npm run log-android',
  'android-release': 'react-native run-android --variant Release',
  ios: 'react-native run-ios',
  'ios-release': 'react-native run-ios --configuration Release',
  build: 'startupjs build --async',
  'start-production': 'startupjs start-production'
}

const DEFAULT_TEMPLATE = 'ui'
const DEFAULT_YARN_VERSION = '4'
const TEMPLATES = {
  simple: {
    subTemplates: ['simple']
  },
  routing: {
    subTemplates: ['simple', 'routing'],
    packages: [
      // === START APP PEER DEPS ===
      'react-native-restart@^0.0.22'
      // === END APP PEER DEPS ===
    ]
  },
  ui: {
    subTemplates: ['simple', 'routing', 'ui'],
    packages: [
      // === START APP PEER DEPS ===
      'react-native-restart@^0.0.22',
      // === END APP PEER DEPS ===

      // === START UI PEER PEDS ===
      `@startupjs/ui@${STARTUPJS_VERSION}`,
      '@react-native-picker/picker@^1.16.1',
      'react-native-collapsible@^1.6.0',
      'react-native-color-picker@^0.6.0',
      'react-native-gesture-handler@1.10.3',
      'react-native-pager-view@^6.2.0',
      'react-native-tab-view@^3.0.0'
      // === END UI PEER DEPS ===
    ]
  }
}

let templatesPath

// ----- init

commander
  .command('init <projectName>')
  .description('bootstrap a new startupjs application')
  .option('-rn, --react-native <semver>', 'Use a particular semver of React Native as a template', 'latest')
  .option('-t, --template <name>', 'Which startupjs template to use to bootstrap the project', DEFAULT_TEMPLATE)
  .option('-y, --yarn <semver>', 'Use a particular semver of yarn', DEFAULT_YARN_VERSION)
  .action(async (projectName, { reactNative, template, yarn }) => {
    console.log('> run npx', projectName, { reactNative, template, yarn })

    // setup corepack
    try {
      await execa.command(
        `${path.join(__dirname, 'corepack.sh')} ${yarn}`,
        { shell: true, stdio: 'inherit' }
      )
    } catch (e) {
      throw Error('Setup corepack: ', e)
    }

    const projectPath = path.join(process.cwd(), LOCAL_DIR, projectName)

    // check if template exists
    if (!TEMPLATES[template]) {
      throw Error(`Template '${template}' doesn't exist. Templates available: ${Object.keys(TEMPLATES).join(', ')}`)
    }

    if (LOCAL_DIR !== '.') {
      await execa(
        'mkdir',
        ['-p', LOCAL_DIR],
        { stdio: 'inherit' }
      )
    }

    // init react-native application
    await execa('npx', [
      '--yes',
      `react-native${'@' + reactNative}`,
      'init',
      '--skip-install',
      projectName
    ].concat(['--version', reactNative]), {
      cwd: path.join(process.cwd(), LOCAL_DIR),
      stdio: 'inherit'
    })

    // specify yarn version
    await execa('rm', ['-rf', 'node_modules'], {
      cwd: projectPath,
      stdio: 'inherit'
    })
    await execa('rm', ['-f', 'yarn.lock'], {
      cwd: projectPath,
      stdio: 'inherit'
    })
    await execa('corepack', ['use', `yarn@${yarn}`], {
      cwd: projectPath,
      stdio: 'inherit'
    })

    // remove extra files which are covered by startupjs core
    if (REMOVE_FILES.length) {
      await execa('rm', ['-f'].concat(REMOVE_FILES), {
        cwd: projectPath,
        stdio: 'inherit'
      })
    }

    await execa('yarn', ['config', 'set', 'nodeLinker', 'node-modules'], {
      cwd: projectPath,
      stdio: 'inherit'
    })

    // remove extra dependencies which are covered by startupjs core
    if (REMOVE_DEPENDENCIES.length) {
      await execa('yarn', ['remove'].concat(REMOVE_DEPENDENCIES), {
        cwd: projectPath,
        stdio: 'inherit'
      })
    }

    // copy additional startupjs template files over react-native ones
    console.log(`> Copy template '${template}'`)
    for (const subTemplate of TEMPLATES[template].subTemplates) {
      const subTemplatePath = path.join(templatesPath, subTemplate)
      await recursivelyCopyFiles(subTemplatePath, projectPath)
    }

    // install startupjs dependencies
    await execa('yarn', ['add'].concat(DEPENDENCIES).concat(TEMPLATES[template].packages || []), {
      cwd: projectPath,
      stdio: 'inherit'
    })

    if (LINK) {
      // TODO: Link startupjs packages. ref:
      //       https://stackoverflow.com/questions/48681642/yarn-workspaces-and-yarn-link
      console.log('> TODO: Link startupjs packages for local install')
    }

    if (DEV_DEPENDENCIES.length) {
      // install startupjs devDependencies
      await execa('yarn', ['add', '-D'].concat(DEV_DEPENDENCIES), {
        cwd: projectPath,
        stdio: 'inherit'
      })
    }

    console.log('> Update config.json')
    updateConfigJson(projectPath, { projectName })

    console.log('> Patch package.json')
    patchPackageJson(projectPath)

    console.log('> Add additional things to .gitignore')
    appendGitignore(projectPath)

    console.log('> Apply module patches from /patches/ folder')
    await execa('yarn', ['postinstall'], {
      cwd: projectPath,
      stdio: 'inherit'
    })

    if (process.platform === 'darwin') {
      await execa('pod', ['install'], {
        cwd: path.join(projectPath, 'ios'),
        stdio: 'inherit'
      })
    }

    if (template === 'ui') {
      await execa('startupjs', ['link'], {
        cwd: projectPath,
        stdio: 'inherit'
      })
    }

    console.log(getSuccessInstructions(projectName))
  })

// ----- init

commander
  .command('start')
  .description('Run "startupjs web" and "startupjs server" at the same time.')
  .option('-i, --inspect', 'Use node --inspect')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.start(options),
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('web')
  .description('Compile (with webpack) and run web')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.web,
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('server')
  .description('Compile (with webpack) and run server')
  .option('-i, --inspect', 'Use node --inspect')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.server(options),
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('build')
  .description('Build web bundles')
  .option('-a, --async', 'Build with splitting code into async chunks loaded dynamically')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.build(options),
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('start-production')
  .description('Start production')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.startProduction,
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('patch-package')
  .description('Apply required patches to libraries used by startupjs')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.patchPackage(options),
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('link')
  .description('Links files')
  .action(async () => {
    // this is important because ./link contains files that are initialized on require. Thus, 'glob' in ./linc/path does not work correctly when required in a header
    const link = require('./link')
    link()
  })

commander
  .command('android-link')
  .description('Links android files')
  .action(async () => {
    console.warn('"startupjs android-link" is deprecated. Use "startupjs link" instead.')
    // this is important because ./link contains files that are initialized on require. Thus, 'glob' in ./linc/path does not work correctly when required in a header
    const link = require('./link')
    link()
  })

commander
  .command('postinstall')
  .description('Run startupjs postinstall scripts')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.postinstall(options),
      { stdio: 'inherit', shell: true }
    )
  })

// ----- project management commands

commander
  .command('init-pm')
  .description('Create a new project on github from template')
  .action(async () => {
    await execa.command(`${PM_SCRIPTS_PATH} init-pm`, { shell: true, stdio: 'inherit' })
    addPmScriptsToPackageJson() // add `yarn pm` and `yarn task` to package.json/scripts
  })

commander
  .command('task <issueNumber>')
  .description('Create a task branch (or just switch to it if it already exists)')
  .action(async (issueNumber) => {
    await execa.command(`${PM_SCRIPTS_PATH} task ${issueNumber}`, { shell: true, stdio: 'inherit' })
  })

commander
  .command('pr [issueNumber]')
  .description('Make PR for this task (or re-request review if it already exists)')
  .action(async (issueNumber = '') => {
    await execa.command(`${PM_SCRIPTS_PATH} pr ${issueNumber}`, { shell: true, stdio: 'inherit' })
  })

// ----- helpers

async function recursivelyCopyFiles (sourcePath, targetPath) {
  const fileNames = fs.readdirSync(sourcePath)

  if (fileNames.length === 0) return

  for (const fileName of fileNames) {
    const filePath = path.join(sourcePath, fileName)
    if (fs.lstatSync(filePath).isDirectory()) {
      const subTargetPath = path.join(targetPath, fileName)
      await execa(
        'mkdir',
        ['-p', subTargetPath],
        { stdio: 'inherit' }
      )
      await recursivelyCopyFiles(filePath, subTargetPath)
    } else {
      await execa(
        'cp',
        [filePath, targetPath],
        { stdio: 'inherit' }
      )
    }
  }
}

function patchPackageJson (projectPath) {
  const packageJSONPath = path.join(projectPath, 'package.json')
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString())

  delete packageJSON.scripts.test
  delete packageJSON.devDependencies['babel-jest']
  delete packageJSON.devDependencies['react-test-renderer']
  delete packageJSON.devDependencies.jest

  packageJSON.type = 'module'

  packageJSON.scripts = {
    ...packageJSON.scripts,
    ...SCRIPTS
  }

  packageJSON['lint-staged'] = {
    '*.{js,jsx}': [
      'eslint --fix',
      'git add'
    ]
  }

  packageJSON.husky = {
    hooks: {
      'pre-commit': 'lint-staged'
    }
  }

  // FIXME: We can't use type=module now, because metro does not support ESM
  // and does not provide ability to pass .cjs config.
  // packageJSON.type = 'module'
  packageJSON.sideEffects = ['*.css', '*.styl']

  fs.writeFileSync(
    packageJSONPath,
    `${JSON.stringify(packageJSON, null, 2)}\n`
  )
}

function addPmScriptsToPackageJson () {
  const projectPath = process.cwd()
  const packageJSONPath = path.join(projectPath, 'package.json')
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString())

  packageJSON.scripts = {
    ...packageJSON.scripts,
    task: 'npx startupjs task',
    pr: 'npx startupjs pr'
  }

  fs.writeFileSync(
    packageJSONPath,
    `${JSON.stringify(packageJSON, null, 2)}\n`
  )
}

function appendGitignore (projectPath) {
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
    sqlite.db
  `.replace(/\n\s+/g, '\n')

  fs.writeFileSync(gitignorePath, gitignore)
}

function updateConfigJson (projectPath, options) {
  const configJsonPath = path.join(projectPath, 'config.json')
  let configJson = fs.readFileSync(configJsonPath).toString()

  try {
    const templateFn = template(configJson)
    const sessionSecret = generateRandomString(32)
    configJson = templateFn({ ...options, sessionSecret })
  } catch (e) {
    console.log(
      '\x1b[31m' +
      'config.json has not been updated, update it manually!' +
      '\x1b[0m'
    )
  }

  fs.writeFileSync(
    configJsonPath,
    configJson
  )
}

function generateRandomString (length = 0) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(
        Math.random() * charactersLength
      )
    )
  }
  return result
}

function getSuccessInstructions (projectName) {
  return `
    StartupJS installation successful!

    To use private packages, log in via yarn npm login.

    INSTRUCTIONS

    $ cd ${projectName}

    Run each command in a separate terminal tab:

    1. Start server:

      $ yarn server

    2. Start web:

      $ yarn web

    and go to http://localhost:3000

    3. Start native:

      $ yarn metro
      $ yarn android
      $ yarn ios
  `
}

// Replace all new lines with spaces to properly handle cli-commands
function oneLine (str) {
  return str.replace(/\s+/g, ' ')
}

exports.run = (options = {}) => {
  if (!options.templatesPath) throw Error('templatesPath not found!')
  templatesPath = options.templatesPath
  commander.parse(process.argv)
}

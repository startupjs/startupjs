const commander = require('commander')
const execa = require('execa')
const path = require('path')
const fs = require('fs')
const version = require('./package.json').version

const IS_ALPHA = /alpha/.test(version)
const STARTUPJS_VERSION = IS_ALPHA ? `^${version.replace(/\.\d+$/, '.0')}` : 'latest'

const DEPENDENCIES = [
  // Install alpha version of startupjs when running the alpha of cli
  `startupjs@${STARTUPJS_VERSION}`,
  'source-map-support',
  'react-native-web@^0.12.0',
  'react-native-svg@^12.1.0',
  'nconf@^0.10.0',
  'react',
  'react-dom',
  // Add hot-loading for web. It has to match the same version in 'bundler' and 'babel-preset-startupjs'
  'react-hot-loader@^4.12.13',
  'axios', // For making AJAX requests
  'patch-package',
  'postinstall-postinstall'
]

const DEV_DEPENDENCIES = [
  '@hot-loader/react-dom',
  'babel-eslint',
  'eslint-config-standard',
  'eslint-config-standard-react',
  'eslint-plugin-import',
  'eslint-plugin-node',
  'eslint-plugin-promise',
  'eslint-plugin-react',
  'eslint-plugin-react-pug',
  'eslint-plugin-standard',
  'lint-staged'
]

const REMOVE_DEPENDENCIES = [
  '@babel/core',
  '@babel/runtime',
  '@react-native-community/eslint-config',
  'metro-react-native-babel-preset'
]

const REMOVE_FILES = [
  '.prettierrc.js',
  'App.js'
]

const SCRIPTS_ORIG = {}
SCRIPTS_ORIG.web = 'WEBPACK_DEV=1 webpack-dev-server --config webpack.web.config.js'
SCRIPTS_ORIG.serverBuild = 'WEBPACK_DEV=1 webpack --watch --config webpack.server.config.js'
SCRIPTS_ORIG.serverRun = inspect => `just-wait -t 1000 --pattern ./build/server.dev.js && nodemon ${inspect ? '--inspect' : ''} ./build/server.dev.js -r source-map-support/register --watch ./build/server.dev.js`
SCRIPTS_ORIG.serverRun.toString = () => SCRIPTS_ORIG.serverRun(false)
SCRIPTS_ORIG.server = inspect => `concurrently -r -s first -k -n 'S,B' -c black.bgWhite,cyan.bgBlue "${SCRIPTS_ORIG.serverRun(inspect)}" "${SCRIPTS_ORIG.serverBuild}"`
SCRIPTS_ORIG.server.toString = () => SCRIPTS_ORIG.server(false)
SCRIPTS_ORIG.start = `concurrently -r -s first -k -n 'S,SB,W' -c black.bgWhite,black.bgWhite,cyan.bgBlue "${SCRIPTS_ORIG.serverRun}" "${SCRIPTS_ORIG.serverBuild}" "${SCRIPTS_ORIG.web}"`
SCRIPTS_ORIG.build = 'rm -rf ./build && webpack --config webpack.server.config.js && webpack --config webpack.web.config.js'
SCRIPTS_ORIG.startProduction = 'NODE_ENV=production node -r source-map-support/register build/server.js'

const SCRIPTS = {
  start: 'startupjs start',
  metro: 'react-native start --reset-cache',
  web: 'startupjs web',
  server: 'startupjs server',
  precommit: 'lint-staged',
  postinstall: 'patch-package',
  adb: 'adb reverse tcp:8081 tcp:8081 && adb reverse tcp:3000 tcp:3000 && adb reverse tcp:3010 tcp:3010',
  'log-android-color': 'react-native log-android | ccze -m ansi -C -o nolookups',
  'log-android': 'hash ccze 2>/dev/null && npm run log-android-color || (echo "WARNING! Falling back to plain logging. For colored logs install ccze - brew install ccze" && react-native log-android)',
  android: 'react-native run-android && (npm run adb || true) && npm run log-android',
  'android-release': 'react-native run-android --configuration Release',
  ios: 'react-native run-ios',
  'ios-release': 'react-native run-ios --configuration Release',
  build: 'startupjs build',
  'start-production': 'startupjs start-production'
}

const DEFAULT_TEMPLATE = 'ui'
const TEMPLATES = {
  simple: {
    subTemplates: ['simple']
  },
  routing: {
    subTemplates: ['simple', 'routing']
  },
  ui: {
    subTemplates: ['simple', 'routing', 'ui'],
    packages: [
      `@startupjs/ui@${STARTUPJS_VERSION}`,
      '@fortawesome/free-solid-svg-icons@^5.12.0',
      'react-native-collapsible',
      'react-native-svg',
      'react-native-status-bar-height'
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
  .action(async (projectName, { version, template }) => {
    console.log('> run npx', projectName, { version, template })

    // check if template exists
    if (!TEMPLATES[template]) {
      throw Error(`Template '${template}' doesn't exist. Templates available: ${Object.keys(TEMPLATES).join(', ')}`)
    }

    let projectPath = path.join(process.cwd(), projectName)

    if (fs.existsSync(projectPath)) {
      const err = `Folder '${projectName}' already exists in the current directory. Delete it to create a new app`
      console.log('!!! ERROR !!! ' + err + '\n\n')
      throw Error(err)
    }

    // check if the folder already exists and throw an error

    // init react-native application
    await execa('npx', [
      `react-native${'@' + version}`,
      'init',
      projectName
    ].concat(['--version', version]), { stdio: 'inherit' })

    // remove extra files which are covered by startupjs core
    if (REMOVE_FILES.length) {
      await execa('rm', ['-f'].concat(REMOVE_FILES), {
        cwd: projectPath,
        stdio: 'inherit'
      })
    }

    // remove extra dependencies which are covered by startupjs core
    if (REMOVE_DEPENDENCIES.length) {
      await execa('yarn', ['remove'].concat(REMOVE_DEPENDENCIES), {
        cwd: projectPath,
        stdio: 'inherit'
      })
    }

    // copy additional startupjs template files over react-native ones
    console.log(`> Copy template '${template}'`)
    for (let subTemplate of TEMPLATES[template].subTemplates) {
      const subTemplatePath = path.join(templatesPath, subTemplate)
      await recursivelyCopyFiles(subTemplatePath, projectPath)
    }

    // install startupjs dependencies
    await execa('yarn', ['add'].concat(DEPENDENCIES).concat(TEMPLATES[template].packages || []), {
      cwd: projectPath,
      stdio: 'inherit'
    })

    if (DEV_DEPENDENCIES.length) {
      // install startupjs devDependencies
      await execa('yarn', ['add', '-D'].concat(DEV_DEPENDENCIES), {
        cwd: projectPath,
        stdio: 'inherit'
      })
    }

    console.log('> Patch package.json with additional scripts')
    addScriptsToPackageJson(projectPath)

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

    console.log(getSuccessInstructions(projectName))
  })

// ----- init

commander
  .command('start')
  .description('Run "startupjs web" and "startupjs server" at the same time.')
  .action(async () => {
    await execa.command(
      SCRIPTS_ORIG.start,
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('server')
  .description('Compile (with webpack) and run server')
  .option('-i, --inspect', 'Use node --inspect')
  .action(async ({ inspect }) => {
    await execa.command(
      SCRIPTS_ORIG.server(inspect),
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('server:build')
  .description('Build server')
  .action(async () => {
    await execa.command(
      SCRIPTS_ORIG.serverBuild,
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('server:run')
  .description('Run server')
  .action(async () => {
    await execa.command(
      SCRIPTS_ORIG.serverRun,
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('build')
  .description('Build server and web bundles')
  .action(async () => {
    await execa.command(
      SCRIPTS_ORIG.build,
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('start-production')
  .description('Start production')
  .action(async () => {
    await execa.command(
      SCRIPTS_ORIG.startProduction,
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('web')
  .description('Run web bundling (webpack)')
  .action(async () => {
    await execa.command(
      SCRIPTS_ORIG.web,
      { stdio: 'inherit', shell: true }
    )
  })

// ----- helpers

async function recursivelyCopyFiles (sourcePath, targetPath) {
  const fileNames = fs.readdirSync(sourcePath)

  if (fileNames.length === 0) return

  for (let fileName of fileNames) {
    let filePath = path.join(sourcePath, fileName)
    if (fs.lstatSync(filePath).isDirectory()) {
      let subTargetPath = path.join(targetPath, fileName)
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

function addScriptsToPackageJson (projectPath) {
  const packageJSONPath = path.join(projectPath, 'package.json')
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString())

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
  `.replace(/\n\s+/g, '\n')

  fs.writeFileSync(gitignorePath, gitignore)
}

function getSuccessInstructions (projectName) {
  return `
    StartupJS installation successful!

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

exports.run = (options = {}) => {
  if (!options.templatesPath) throw Error('templatesPath not found!')
  templatesPath = options.templatesPath
  commander.parse(process.argv)
}

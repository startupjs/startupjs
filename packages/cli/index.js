const commander = require('commander')
const execa = require('execa')
const path = require('path')
const fs = require('fs')

const DEPENDENCIES = [
  'startupjs',
  'source-map-support',
  'react-native-web@0.11.7',
  'react-native-code-push@^5.7.0',
  'nconf@^0.10.0',
  'react',
  'react-dom',
  'react-hot-loader', // To add hot-loading for web
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
SCRIPTS_ORIG.serverRun = 'just-wait -t 1000 --pattern ./build/server.dev.js && nodemon ./build/server.dev.js -r source-map-support/register --watch ./build/server.dev.js'
SCRIPTS_ORIG.server = `concurrently -s first -k -n 'S,B' -c black.bgWhite,cyan.bgBlue "${SCRIPTS_ORIG.serverRun}" "${SCRIPTS_ORIG.serverBuild}"`
SCRIPTS_ORIG.start = `concurrently -s first -k -n 'S,SB,W' -c black.bgWhite,black.bgWhite,cyan.bgBlue "${SCRIPTS_ORIG.serverRun}" "${SCRIPTS_ORIG.serverBuild}" "${SCRIPTS_ORIG.web}"`
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
  'android-release': 'BABEL_ENV=production react-native run-android --configuration Release',
  ios: 'react-native run-ios',
  'ios-release': 'BABEL_ENV=production react-native run-ios --configuration Release',
  build: 'startupjs build',
  'start-production': 'startupjs start-production'
}

let templatesPath
let availableTemplates

// ----- init

commander
  .command('init <projectName>')
  .description('bootstrap a new startupjs application')
  .option('-v, --version <semver>', 'Use a particular semver of React Native as a template', 'latest')
  .option('-t, --template <name>', 'Which startupjs template to use to bootstrap the project', 'simple')
  .action(async (projectName, { version, template }) => {
    console.log('> run npx', projectName, { version, template })

    // check if template exists
    if (!availableTemplates.includes(template)) {
      Error(`Template '${template}' doesn't exist. Templates available: ${availableTemplates.join(', ')}`)
    }

    // init react-native application
    await execa('npx', [
      `react-native${'@' + version}`,
      'init',
      projectName
    ].concat(['--version', version]), { stdio: 'inherit' })

    let projectPath = path.join(process.cwd(), projectName)

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

    // install startupjs dependencies
    await execa('yarn', ['add'].concat(DEPENDENCIES), {
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

    let templatePath = path.join(templatesPath, template)
    console.log('> Copy template', { projectPath, templatePath })
    const files = fs
      .readdirSync(templatePath)
      .map(name => path.join(templatePath, name))

    // copy additional startupjs template files over react-native ones
    await execa(
      'cp',
      ['-r'].concat(files).concat([projectPath]),
      { stdio: 'inherit' }
    )

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
  .action(async () => {
    await execa.command(
      SCRIPTS_ORIG.server,
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
  availableTemplates = fs.readdirSync(templatesPath)
  commander.parse(process.argv)
}

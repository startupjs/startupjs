const commander = require('commander')
const execa = require('execa')
const path = require('path')
const fs = require('fs')
const Font = require('fonteditor-core').Font
const link = require('./link')
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

const LINK = !!process.env.LINK
const LOCAL_DIR = process.env.LOCAL_DIR || '.'

const DEPENDENCIES = [
  // Install alpha version of startupjs when running the alpha of cli
  `startupjs@${STARTUPJS_VERSION}`,
  'react-native-svg@^12.1.0',
  'nconf@^0.10.0',
  'react',
  'react-dom',
  'axios' // For making AJAX requests
]

const DEV_DEPENDENCIES = [
  'babel-eslint',
  'babel-jest',
  'concurrently',
  'detox',
  'eslint@latest',
  'eslint-config-standard',
  'eslint-config-standard-react',
  'eslint-plugin-import',
  'eslint-plugin-import-helpers',
  'eslint-plugin-node',
  'eslint-plugin-promise',
  'eslint-plugin-react',
  'eslint-plugin-react-pug',
  'eslint-plugin-standard',
  'husky@^4.3.0',
  'jest',
  'jest-circus',
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
  '.eslintrc.js',
  'App.js',
  'babel.config.js',
  'metro.config.js'
]

const SCRIPTS_ORIG = {}

// Web

SCRIPTS_ORIG.web = ({ reset, vite, webpack } = {}) => {
  if (vite && !webpack) {
    return SCRIPTS_ORIG.webVite({ reset })
  } else {
    return SCRIPTS_ORIG.webWebpack
  }
}

SCRIPTS_ORIG.webVite = ({ reset } = {}) => oneLine(`
  ${reset ? 'rm -rf node_modules/.vite_opt_cache &&' : ''}
  VITE_WEB=1
  vite --port=3010 -c vite.config.cjs
`)

SCRIPTS_ORIG.webWebpack = oneLine(`
  WEBPACK_DEV=1
  webpack-dev-server --config webpack.web.config.cjs
`)

// Server

SCRIPTS_ORIG.server = ({ inspect, vite, webpack, pure } = {}) => {
  if (pure && !webpack) {
    return SCRIPTS_ORIG.serverPure({ inspect, vite })
  } else {
    return SCRIPTS_ORIG.serverWebpack({ inspect, vite })
  }
}

SCRIPTS_ORIG.serverPure = ({ inspect, vite } = {}) => oneLine(`
  ${vite ? 'VITE=1' : ''}
  nodemon
    --experimental-specifier-resolution=node
    ${inspect ? '--inspect' : ''}
    -e js,mjs,cjs,json,yaml server.js
    --delay 3
    --watch model/
    --watch hooks/
    --watch cron/
    --watch helpers/
    --watch serverHelpers/
    --watch isomorphicHelpers/
    --watch '**/routes.js'
    --watch server/
    --watch config.json
`)

SCRIPTS_ORIG.serverWebpack = (options) => oneLine(`
  concurrently
    -r -s first -k -n 'S,B'
    -c black.bgWhite,black.bgWhite
    "${SCRIPTS_ORIG.serverWebpackRun(options)}"
    "${SCRIPTS_ORIG.serverWebpackBuild}"
`)

SCRIPTS_ORIG.serverWebpackBuild = oneLine(`
  WEBPACK_DEV=1
  webpack --watch --config webpack.server.config.cjs
`)

SCRIPTS_ORIG.serverWebpackRun = ({ inspect, vite }) => oneLine(`
  just-wait -t 1000 --pattern ./build/server.dev.cjs &&
  ${vite ? 'VITE=1' : ''}
  nodemon
    --experimental-specifier-resolution=node
    ${inspect ? '--inspect' : ''}
    ./build/server.dev.cjs
    -r source-map-support/register
    -e js,mjs,cjs,json,yaml
    --watch ./build/server.dev.cjs
`)

// Start (web and server)

SCRIPTS_ORIG.start = (options = {}) => {
  if (options.pure && !options.webpack) {
    return SCRIPTS_ORIG.startPure(options)
  } else {
    return SCRIPTS_ORIG.startWebpack(options)
  }
}

SCRIPTS_ORIG.startPure = (...args) => oneLine(`
  concurrently
    -r -s first -k -n 'S,W'
    -c black.bgWhite,cyan.bgBlue
    "${SCRIPTS_ORIG.server(...args)}"
    "${SCRIPTS_ORIG.web(...args)}"
`)

SCRIPTS_ORIG.startWebpack = (options) => oneLine(`
  concurrently
    -r -s first -k -n 'S,B,W'
    -c black.bgWhite,black.bgWhite,cyan.bgBlue
    "${SCRIPTS_ORIG.serverWebpackRun(options)}"
    "${SCRIPTS_ORIG.serverWebpackBuild}"
    "${SCRIPTS_ORIG.web(options)}"
`)

// Production build

SCRIPTS_ORIG.build = ({ async, pure } = {}) => oneLine(`
  rm -rf ./build &&
  ${pure ? '' : 'webpack --config webpack.server.config.cjs &&'}
  ${async ? 'ASYNC=1' : ''}
  webpack --config webpack.web.config.cjs
`)

SCRIPTS_ORIG.startProduction = ({ pure }) => {
  if (pure) {
    return SCRIPTS_ORIG.startProductionPure
  } else {
    return SCRIPTS_ORIG.startProductionWebpack
  }
}

SCRIPTS_ORIG.startProductionPure = oneLine(`
  NODE_ENV=production
  node
    --experimental-specifier-resolution=node
    server.js
`)

SCRIPTS_ORIG.startProductionWebpack = oneLine(`
  NODE_ENV=production
  node
    --experimental-specifier-resolution=node
    -r source-map-support/register
    build/server.cjs
`)

SCRIPTS_ORIG.patchPackage = () => oneLine(`
  npx patch-package --patch-dir ${PATCHES_DIR}
`)

SCRIPTS_ORIG.fonts = () => oneLine(`
  react-native-asset
`)

SCRIPTS_ORIG.postinstall = () => oneLine(`
  ${SCRIPTS_ORIG.patchPackage()} && ${SCRIPTS_ORIG.fonts()}
`)

const SCRIPTS = {
  start: 'startupjs start',
  metro: 'react-native start --reset-cache',
  web: 'startupjs web',
  server: 'startupjs server',
  precommit: 'lint-staged',
  postinstall: 'startupjs postinstall',
  adb: 'adb reverse tcp:8081 tcp:8081 && adb reverse tcp:3000 tcp:3000 && adb reverse tcp:3010 tcp:3010',
  'log-android-color': 'react-native log-android | ccze -m ansi -C -o nolookups',
  'log-android': 'hash ccze 2>/dev/null && npm run log-android-color || (echo "WARNING! Falling back to plain logging. For colored logs install ccze - brew install ccze" && react-native log-android)',
  android: 'react-native run-android && (npm run adb || true) && npm run log-android',
  'android-release': 'react-native run-android --variant Release',
  ios: 'react-native run-ios',
  'ios-release': 'react-native run-ios --configuration Release',
  build: 'startupjs build --async',
  'start-production': 'startupjs start-production',
  fonts: 'startupjs fonts'
}

const getTestScripts = projectName => {
  return {
    'test:build:ios': 'detox build -c ios',
    'test:build:android': 'detox build -c android',
    'test:server': `PORT=3001 MONGO_URL=mongodb://localhost:27017/${projectName}_test yarn start-production`,
    'test:clear-db': `mongo ${projectName}_test --eval 'db.dropDatabase();'`,
    'test:ios': 'detox test -c ios --artifacts-location $PWD/artifacts --take-screenshots all',
    'test:android': 'detox test -c android --loglevel trace',
    test: 'concurrently -s first -k -n "S,T" -c white,cyan.bgBlue "yarn test:clear-db && yarn build && yarn test:server" "yarn build:jsbundle:ios && yarn test:ios"',
    'build:jsbundle:ios': `mkdir -p ios/build/Build/Products/Release-iphonesimulator/${projectName}.app/ && APP_ENV=detox react-native bundle --entry-file="index.js" --bundle-output="./ios/build/Build/Products/Release-iphonesimulator/${projectName}.app/main.jsbundle" --reset-cache --dev=false`
  }
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
      'react-native-gesture-handler@^1.9.0',
      'react-native-reanimated@^1.13.2',
      '@react-native-community/datetimepicker@^3.0.6',
      '@react-native-picker/picker@^1.9.3',
      'react-native-collapsible@1.5.2'
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
  .action(async (projectName, { reactNative, template }) => {
    console.log('> run npx', projectName, { reactNative, template })

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

    let projectPath = path.join(process.cwd(), LOCAL_DIR, projectName)

    if (fs.existsSync(projectPath)) {
      const err = `Folder '${projectName}' already exists in the current directory. Delete it to create a new app`
      console.log('!!! ERROR !!! ' + err + '\n\n')
      throw Error(err)
    }

    // check if the folder already exists and throw an error

    // init react-native application
    await execa('npx', [
      `react-native${'@' + reactNative}`,
      'init',
      projectName
    ].concat(['--version', reactNative]), {
      cwd: path.join(process.cwd(), LOCAL_DIR),
      stdio: 'inherit'
    })

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

    console.log('> Patch package.json with additional scripts')
    addScriptsToPackageJson(projectPath, projectName)

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
      await execa('startupjs', ['android-link'], {
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
  .option('-p, --pure', 'Don\'t use any build system for node')
  .option('-v, --vite', 'Use ES Modules and Vite for development instead of Webpack')
  .option('-w, --webpack', 'Force use Webpack. This will take priority over --vite and --pure option.')
  .option('-r, --reset', 'Reset Vite cache before starting the server. This is helpful when you are directly monkey-patching node_modules')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.start(options),
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('server')
  .description('Compile (with webpack) and run server')
  .option('-i, --inspect', 'Use node --inspect')
  .option('-p, --pure', 'Don\'t use any build system')
  .option('-w, --webpack', 'Force use Webpack for server build. This takes priority over --pure option')
  .option('-v, --vite', 'Automatically redirect to the web bundle served by Vite. Use this when running Vite for web client')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.server(options),
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('build')
  .description('Build web bundles')
  .option('-p, --pure', 'Don\'t use any build system for node')
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
  .option('-p, --pure', 'Don\'t use any build system for node')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.startProduction(options),
      { stdio: 'inherit', shell: true }
    )
  })

commander
  .command('web')
  .description('Run web bundling (Webpack). Insead of bundling you can also use Vite and ES Modules by specifying --vite')
  .option('-v, --vite', 'Use ES Modules and Vite for development instead of Webpack')
  .option('-w, --webpack', 'Force use Webpack. This takes priority over --vite option.')
  .option('-r, --reset', 'Reset Vite cache before starting the server. This is helpful when you are directly monkey-patching node_modules')
  .action(async (options) => {
    await execa.command(
      SCRIPTS_ORIG.web(options),
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
  .command('android-link')
  .description('Links android files')
  .action(async () => {
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

commander
  .command('fonts')
  .description('Rename fonts and react-native smart linking for assets')
  .action(async (options) => {
    renameFonts()

    await execa.command(
      SCRIPTS_ORIG.fonts(options),
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

function renameFonts () {
  const FONTS_PATH = process.cwd() + '/public/fonts'
  const EXT_WISHLIST = ['eot', 'otf', 'ttf', 'woff', 'woff2']
  const IGNORE = ['.gitignore', '.DS_Store', '.gitallowed']

  if (fs.existsSync(FONTS_PATH)) {
    const files = fs.readdirSync(FONTS_PATH)

    files.forEach(file => {
      if (IGNORE.includes(file)) return

      const [fileName, fileExt] = file.split('.')
      if (EXT_WISHLIST.indexOf(fileExt) === -1) {
        return console.error(`Font format error: ${fileExt} is not supported`)
      }

      const buffer = fs.readFileSync(`${FONTS_PATH}/${file}`)
      const font = Font.create(buffer, { type: fileExt })

      if (font.get().name.fontFamily === fileName) return
      font.get().name.fontFamily = fileName
      font.get().name.fontSubFamily = fileName
      font.get().name.preferredFamily = fileName

      const bufferUpdate = font.write({ type: fileExt })
      fs.writeFile(`${FONTS_PATH}/${file}`, bufferUpdate, (err) => {
        if (err) return console.log(err)
        console.log(`${file} rename font-family`)
      })
    })
  }
}

function addScriptsToPackageJson (projectPath, projectName) {
  const packageJSONPath = path.join(projectPath, 'package.json')
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString())

  packageJSON.scripts = {
    ...packageJSON.scripts,
    ...SCRIPTS,
    ...getTestScripts(projectName)
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

  packageJSON.jest = {
    preset: 'react-native'
  }

  // FIXME: We can't use type=module now, because metro does not support ESM
  // and does not provide ability to pass .cjs config.
  // packageJSON.type = 'module'
  packageJSON.sideEffects = []

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
    # Detox
    /artifacts/
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

// Replace all new lines with spaces to properly handle cli-commands
function oneLine (str) {
  return str.replace(/\s+/g, ' ')
}

exports.run = (options = {}) => {
  if (!options.templatesPath) throw Error('templatesPath not found!')
  templatesPath = options.templatesPath
  commander.parse(process.argv)
}

const commander = require('commander')
const execa = require('execa')
const path = require('path')
const fs = require('fs')

const DEPENDENCIES = [
  'startupjs',
  '@hot-loader/react-dom',
  'dm-bundler@^1.0.0-alpha.14',
  'dm-sharedb-server@^9.0.0-alpha.1',
  'nconf@^0.10.0',
  'react-dom',
  'react-native-web@^0.11.7',
  'concurrently',
  'just-wait',
  'moment',
  'nodemon'
]

const DEV_DEPENDENCIES = [
  'webpack',
  'webpack-cli',
  'webpack-dev-server'
]

const SCRIPTS = {
  "metro": "react-native start --reset-cache",
  "web": "webpack-dev-server --config webpack.web.config.js",
  "server": "concurrently -s first -k -n 'S,B' -c black.bgWhite,cyan.bgBlue \"npm run server:run\" \"npm run server:build\"",
  "server:build": "WEBPACK_DEV=1 webpack --watch --config webpack.server.config.js",
  "server:run": "just-wait -t 1000 --pattern \"./build/server.dev.js\" && nodemon \"./build/server.dev.js\" -r source-map-support/register --watch \"./build/server.dev.js\""
}

const SUCCESS_INSTRUCTIONS = `
StartupJS installation successful!

INSTRUCTIONS

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

let templatePath

commander
  .command('init <projectName>')
  .description('bootstrap a new startupjs application')
  .option('-v, --version <semver>', 'Use a particular semver of React Native as a template')
  .action(async (projectName, { version }) => {
    console.log('> run npx', projectName, { version })

    // init react-native application
    await execa('npx', [
      `react-native${ version ? ('@' + version) : '' }`,
      'init',
      projectName
    ].concat(version ? ['--version', version] : []), { stdio: 'inherit' })

    let projectPath = path.join(process.cwd(), projectName)

    // install startupjs dependencies
    await execa('yarn', ['add'].concat(DEPENDENCIES), {
      cwd: projectPath,
      stdio: 'inherit'
    })

    // install startupjs devDependencies
    await execa('yarn', ['add', '-D'].concat(DEV_DEPENDENCIES), {
      cwd: projectPath,
      stdio: 'inherit'
    })

    console.log('> Copy template', { projectPath, templatePath })
    files = fs
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
    console.log(SUCCESS_INSTRUCTIONS)
  })

function addScriptsToPackageJson (projectPath) {
  const packageJSONPath = path.join(projectPath, 'package.json')
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString())

  packageJSON.scripts = {
    ...packageJSON.scripts,
    ...SCRIPTS
  }
  fs.writeFileSync(
    packageJSONPath,
    `${JSON.stringify(packageJSON, null, 2)}\n`,
  )
}

exports.run = (options = {}) => {
  if (!options.templatePath) throw Error('templatePath not found!')
  templatePath = options.templatePath
  commander.parse(process.argv)
}

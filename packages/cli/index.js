const commander = require('commander')
const execa = require('execa')
const path = require('path')
const fs = require('fs')

const DEPENDENCIES = [
  'startupjs',
  '@hot-loader/react-dom',
  'dm-sharedb-server@^9.0.0-alpha.1',
  'nconf@^0.10.0',
  'react-dom',
  'react-native-web@0.11.7',
  'patch-package',
  'postinstall-postinstall'
]

const DEV_DEPENDENCIES = [
  // empty for now
]

const SCRIPTS_ORIG = {}
SCRIPTS_ORIG.web = 'webpack-dev-server --config webpack.web.config.js'
SCRIPTS_ORIG.serverBuild = 'WEBPACK_DEV=1 webpack --watch --config webpack.server.config.js'
SCRIPTS_ORIG.serverRun = 'just-wait -t 1000 --pattern ./build/server.dev.js && nodemon ./build/server.dev.js -r source-map-support/register --watch ./build/server.dev.js'
SCRIPTS_ORIG.server = `concurrently -s first -k -n 'S,B' -c black.bgWhite,cyan.bgBlue \"${SCRIPTS_ORIG.serverRun}\" \"${SCRIPTS_ORIG.serverBuild}\"`

const SCRIPTS = {
  metro: 'react-native start --reset-cache',
  web: 'startupjs web',
  server: 'startupjs server',
  postinstall: 'patch-package'
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

// ----- init

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

    if (DEV_DEPENDENCIES.length) {
      // install startupjs devDependencies
      await execa('yarn', ['add', '-D'].concat(DEV_DEPENDENCIES), {
        cwd: projectPath,
        stdio: 'inherit'
      })
    }

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

    console.log('> Apply module patches from /patches/ folder')
    await execa('yarn', ['postinstall'], {
      cwd: projectPath,
      stdio: 'inherit'
    })

    console.log(SUCCESS_INSTRUCTIONS)
  })

// ----- init

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

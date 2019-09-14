const commander = require('commander')
const execa = require('execa')
const path = require('path')

const DEPENDENCIES = [
  'startupjs',
  '@hot-loader/react-dom',
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

    let templatePath = require.resolve('startupjs/template')
    console.log({ templatePath })

    // copy additional startupjs template files over react-native ones
    await execa(
      'cp',
      ['-r', `${templatePath}/*`, `${templatePath}/.*`, projectPath],
      { stdio: 'inherit' }
    )
  })

exports.run = () => {
  commander.parse(process.argv)
}

const commander = require('commander')
const execa = require('execa')
const path = require('path')

commander
  .command('init <projectName>')
  .description('bootstrap a new startupjs application')
  .option('-v, --version', 'Use a particular semver of React Native as a template')
  .action(async (projectName, { version }) => {
    console.log('> run npx')
    await execa('npx', [
      `react-native${ version ? ('@' + version) : '' }`,
      'init',
      projectName
    ].concat(version ? ['--version', version] : []), { stdio: 'inherit' })
    await execa('yarn', ['add', 'startupjs'], {
      cwd: path.join(process.cwd(), projectName),
      stdio: 'inherit'
    })
  })

exports.run = () => {
  commander.parse(process.argv)
}

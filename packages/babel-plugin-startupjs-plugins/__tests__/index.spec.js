const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    env: 'server',
    root: process.cwd() + '/fixtures'
  },
  tests: {
    'Ignores files without a magic import': /* js */`
      import something from 'startupjs/something'
    `,
    'Processes files with a magic import': /* js */`
      import plugins from 'startupjs/plugins'
      import init from 'startupjs/init'
      import orm from '../model'

      init({ orm, plugins })
    `
  }
})

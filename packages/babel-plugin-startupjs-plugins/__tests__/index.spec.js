const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    root: process.cwd() + '/fixtures'
  },
  tests: {
    'Ignores files without a magic import with magic function': /* js */`
      import { createPlugin } from 'startupjs/registry'
    `,
    'Processes files with a magic import with magic function': /* js */`
      import { createProject } from 'startupjs/registry'
      import dummy from '@dummy/dummy'

      const x = 'xxx'
      dummy(x)

      export default createProject({
        plugins: {
          'module-1': {
            server: {
              bar: 'World'
            }
          },
          'module-1/module-1-plugin': {
            server: {
              thing: 'Hello'
            }
          }
        }
      })
    `
  }
})

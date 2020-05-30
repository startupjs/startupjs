const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {},
  tests: {
    'Ignores files without @asyncImports annotation': /* js */`
      console.log('Hello World')
    `,
    'Processes files with @asyncImports annotation and imports lazy automatically': /* js */`
      /* @asyncImports */
      console.log('Hello World')
    `,
    'Imports lazy and transforms import to use it': /* js */`
      /* @asyncImports */
      import PHome from './PHome'
      import PGames from './PGames'
      export { PHome, PGames }
      console.log('Hello World')
    `,
    'Imports lazy and transforms export to use it': /* js */`
      /* @asyncImports */
      export { default as PHome } from './PHome'
      export { default as PGames } from './PGames'
      console.log('Hello World')
    `
  }
})

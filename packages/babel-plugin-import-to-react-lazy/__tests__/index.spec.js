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
    `,
    'Processes files with multiple import and export declarations': /* js */ `
      /* @asyncImports */
      import PHome from './PHome';
      import PGames from './PGames';
      export { default as PHome } from './PHome';
      export { default as PGames } from './PGames';
      console.log('Hello World');
    `,
    'Processes files with multiple exports and a mix of imports and exports': /* js */ `
      /* @asyncImports */
      import PHome from './PHome';
      import PGames from './PGames';
      export { PHome, PGames };
      export { default as PProfile } from './PProfile';
      console.log('Hello World');
    `,
    'Ignores named imports and exports': /* js */ `
      /* @asyncImports */
      import { Home } from './PHome';
      export { Home };
      console.log('Hello World');
    `,
    'Ignores files with import and export declarations without default specifier': /* js */ `
      /* @asyncImports */
      import { PHome } from './PHome';
      import { PGames } from './PGames';
      export { PHome, PGames };
      console.log('Hello World');
    `
  }
})

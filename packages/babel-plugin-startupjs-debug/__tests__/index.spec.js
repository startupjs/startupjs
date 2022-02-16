const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  babelOptions: {
    plugins: ['@babel/plugin-syntax-jsx']
  },
  pluginOptions: {
    __test__: {
      filename: '/ws/dummy-project/component.js'
    }
  },
  tests: {
    'Doesn\'t execute without magic observer import': /* js */`
      import { observer } from 'foobar'

      export default observer(() => {})
    `,
    'Simple. Default export': /* js */`
      import { observer } from 'startupjs'

      export default observer(function Main () {
        return <span>Hello</span>
      })
    `,
    'Simple. Default export with extra parens in code': /* js */`
      import { observer } from 'startupjs'

      export default observer(function Main ({ title }) {
        console.log(/)/.test(title)) // Test for ) here
        return <span>Hello</span>
      })
    `,
    'Simple. Export named const': /* js */`
      import { observer } from 'startupjs'

      export const Main = observer(({ title }) => {
        console.log(/)/.test(title)) // Test for ) here
        return <span>Hello</span>
      })
    `,
    'Advanced. With options': /* js */`
      import { observer } from 'startupjs'

      export default observer(function Main ({ title }) {
        return <span>Hello</span>
      }, { forwardRef: true, suspenseProps: { loader: <span>Loading</span> } })
    `,
    'Advanced. Multiple components, with options and with another name': /* js */`
      import { observer as myObserver } from 'startupjs'

      export default myObserver(function Main ({ title }) {
        return <span>Hello</span>
      })

      const Sub = myObserver(function ({ title }) {
        return <span>Hello</span>
      })

      const Sub2 = myObserver(({ title }) => {
        console.log(/)/.test(title)) // Test for ) here
        return <span>Hello</span>
      }, { forwardRef: true, suspenseProps: { loader: <span>Loading</span> } })
    `
  }
})

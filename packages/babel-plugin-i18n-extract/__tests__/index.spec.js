const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {},
  babelOptions: {
    plugins: ['@babel/plugin-syntax-jsx']
  },
  error: true,
  tests: [
    {
      title: 'Call without arguments',
      error: true,
      code: `
        import { observer, t } from 'startupjs'

        export default observer(function App () {
          return (
            <span>
              {t()}
            </span>
          )
        })
      `
    },
    {
      title: 'Call only with \'key\' argument',
      error: true,
      code: `
        import { observer, t } from 'startupjs'

        export default observer(function App () {
          return (
            <span>
              {t('key')}
            </span>
          )
        })
      `
    },
    {
      title: 'Call with empty \'key\' argument',
      error: true,
      code: `
        import { observer, t } from 'startupjs'

        export default observer(function App () {
          return (
            <span>
              {t('', 'defaultValue')}
            </span>
          )
        })
      `
    },
    {
      title: 'Call with empty \'defaultValue\' argument',
      error: true,
      code: `
        import { observer, t } from 'startupjs'

        export default observer(function App () {
          return (
            <span>
              {t('key', '')}
            </span>
          )
        })
      `
    },
    {
      title: 'String literal is not passed to the \'key\' argument',
      error: true,
      code: `
        import { observer, t } from 'startupjs'
        const x

        export default observer(function App () {
          return (
            <span>
              {t(x, 'defaultValue')}
            </span>
          )
        })
      `
    },
    {
      title: 'String literal is not passed to the \'defaultValue\' argument',
      error: true,
      code: `
        import { observer, t } from 'startupjs'
        const x

        export default observer(function App () {
          return (
            <span>
              {t('key', x)}
            </span>
          )
        })
      `
    },
    {
      title: 'Correct call',
      code: `
        import { observer, t } from 'startupjs'

        export default observer(function App () {
          return (
            <span>
              {t('key', 'defaultValue')}
            </span>
          )
        })
      `
    }
  ]
})

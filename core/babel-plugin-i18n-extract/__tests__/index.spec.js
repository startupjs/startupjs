const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

// TODO: Add test that tests merge extensions

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {},
  babelOptions: {
    plugins: ['@babel/plugin-syntax-jsx']
  },
  // since the filename is empty when we pass the 'code' to test object
  // then we could use fixtures
  // but we can't use fixtures because of this bug https://github.com/babel-utils/babel-plugin-tester/issues/74
  // so as a workaround just pass the filename in the plugin options
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
        const key = 'key'

        export default observer(function App () {
          return (
            <span>
              {t(key, 'defaultValue')}
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
        const defaultValue = 'defaultValue'

        export default observer(function App () {
          return (
            <span>
              {t('key', defaultValue)}
            </span>
          )
        })
      `
    },
    {
      title: 'Call with custom name',
      error: true,
      code: `
        import { observer, t as myT } from 'startupjs'
        const key = 'key'

        export default observer(function App () {
          return (
            <span>
              {myT(key, 'defaultValue')}
            </span>
          )
        })
      `
    },
    {
      title: 'Correct call',
      pluginOptions: {
        filename: 'correct.js'
      },
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
    },
    {
      title: 'Ignore if not import',
      code: `
        import { observer } from 'startupjs'
        export default observer(function App () {
          const t = useTranslation()
          return (
            <span>
              {t('key', 'defaultValue')}
            </span>
          )
        })
      `
    },
    {
      title: 'Ignore shadowing',
      code: `
        import { observer, t } from 'startupjs'
        export default observer(function App () {
          const t = useTranslation()
          return (
            <span>
              {t('key', 'defaultValue')}
            </span>
          )
        })
      `
    },
    {
      title: 'Ignore if not used import with custom name',
      code: `
        import { observer, t as myT } from 'startupjs'
        export default observer(function App () {
          const t = useTranslation()
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

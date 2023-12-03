const pluginTester = require('babel-plugin-tester').default
const plugin = require('../index')
const { name: pluginName } = require('../package.json')

const LONGER_EXAMPLE = /* js */`
  import usedByFoo from 'used-by-foo'
  import usedByDefault from 'used-by-default'
  import usedByBar from 'used-by-bar'

  const varInFoo = 'var-in-foo'
  const varInDefault = 'var-in-default'
  const varInBar = 'var-in-bar'

  export const foo = () => {
    return usedByFoo(varInFoo)
  }

  export default () => {
    return usedByDefault(varInDefault)
  }

  export function bar () {
    return usedByBar(varInBar)
  }
`

pluginTester({
  plugin,
  pluginName,
  snapshot: true,
  pluginOptions: {
    removeExports: ['preload', 'staticPreload']
  },
  tests: {
    'removes export function declaration. 1': /* js */`
      export function preload() {
        return {}
      }
    `,
    'removes export function declaration. 2': /* js */`
      export function staticPreload() {
        return {}
      }
    `,
    'removes references that are only used in server exports': /* js */`
      var readFile = require('fs').readFile
      import foo from 'foo'
      // This is kept since it's not used by ssr exports
      import { getStaticProps } from './'
      const a = 1
      function bar() {

      }
      var shouldHeep = 2
      var alsoShouldKeep =3
      console.log(alsoShouldKepp)
      export function preload() {
        return {a, bar, foo, readFile: readFile.toString()}
      }
    `,
    'removes export variable declaration': /* js */`
      export var preload= function() {
        return {}
      }
    `,
    'removes re-exports': /* js */`
      export {preload} from './'
    `,
    'keeps other exports': /* js */`
      export const a = 1
      export {preload} from './'
    `,
    'removes destructuring assignment (array)': /* js */`
      const [a,b,c] = d
      const e = d[0]
      export const preload = () => {
        console.log(a,b,c,e)
      }
    `,
    'longer example. Remove `foo`': {
      pluginOptions: {
        removeExports: ['foo']
      },
      code: LONGER_EXAMPLE
    },
    'longer example. Remove `foo`, `default`': {
      pluginOptions: {
        removeExports: ['foo', 'default']
      },
      code: LONGER_EXAMPLE
    },
    'throws error if both `removeExports` and `keepExports` are specified': {
      pluginOptions: {
        removeExports: ['foo'],
        keepExports: ['bar']
      },
      error: true,
      code: /* js */`
        export const foo = () => {}
        export function bar () {}
      `
    },
    'longer example. Keep `foo`': {
      pluginOptions: {
        keepExports: ['foo']
      },
      code: LONGER_EXAMPLE
    },
    'longer example. Keep `foo`, `default`': {
      pluginOptions: {
        keepExports: ['foo', 'default']
      },
      code: LONGER_EXAMPLE
    }
  }
})

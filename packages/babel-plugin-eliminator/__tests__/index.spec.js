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
    },
    'object in magic function. Only parse magic function': {
      pluginOptions: {
        keepObjectKeysOfFunction: {
          createProject: {
            magicImports: ['startupjs/registry', '@startupjs/registry'],
            targetObjectJsonPath: '$.plugins.*',
            ensureOnlyKeys: ['client', 'isomorphic', 'server', 'build'],
            keepKeys: ['client']
          }
        }
      },
      code: /* js */`
        import { createProject2 } from 'startupjs/registry'
        export default createProject2({
          plugins: {
            'serve-static-promo': {
              client: {
                redirectUrl: '/promo',
              },
              server: {
                testServer: 'hello server',
              }
            }
          }
        })
      `
    },
    'object in magic function. Throw error if there are keys other than `ensureOnlyKeys`': {
      pluginOptions: {
        keepObjectKeysOfFunction: {
          createProject: {
            magicImports: ['startupjs/registry', '@startupjs/registry'],
            targetObjectJsonPath: '$.plugins.*',
            ensureOnlyKeys: ['client', 'isomorphic', 'server', 'build'],
            keepKeys: ['client']
          }
        }
      },
      error: true,
      code: /* js */`
        import { createProject } from 'startupjs/registry'
        export default createProject({
          plugins: {
            'serve-static-promo': {
              client: {
                redirectUrl: '/promo'
              }
            },
            permissions: {
              client: {
                roles: ['admin', 'user']
              },
              magic: {
                testMagic: 'hello magic'
              }
            }
          }
        })
      `
    },
    // Removing keys from object within magic function call
    'object in magic function. Keep keys `client` and `isomorphic`': {
      pluginOptions: {
        keepObjectKeysOfFunction: {
          createProject: {
            magicImports: ['startupjs/registry', '@startupjs/registry'],
            targetObjectJsonPath: '$.plugins.*',
            ensureOnlyKeys: ['client', 'isomorphic', 'server', 'build'],
            keepKeys: ['client', 'isomorphic']
          }
        }
      },
      code: /* js */`
        import { createProject } from 'startupjs/registry'
        import { clientLib, clientLib2 } from 'client-lib'
        import { serverLib, serverLib2 } from 'server-lib'
        import buildLib from 'build-lib'
        import isomorphicLib from 'isomorphic-lib'

        const clientVar = clientLib()
        const clientVar2 = clientLib2()
        const serverVar = serverLib()
        const serverVar2 = serverLib2()
        const buildVar = buildLib()
        const isomorphicVar = isomorphicLib()

        export default createProject({
          plugins: {
            'serve-static-promo': {
              client: {
                redirectUrl: '/promo',
                testClient: 'hello client',
                clientVar
              },
              server: {
                testServer: 'hello server',
                serverVar
              },
              build: {
                testBuild: 'hello build',
                buildVar
              },
              isomorphic: {
                testIsomorphic: 'hello isomorphic',
                isomorphicVar
              }
            },
            permissions: {
              client: {
                testClient: 'permissions client',
                clientVar2
              },
              server: {
                testServer: 'permissions server',
                roles: ['admin', 'user'],
                serverVar2
              },
              build: {
                testBuild: 'permissions build',
                buildVar
              },
              isomorphic: {
                testIsomorphic: 'permissions isomorphic',
                isomorphicVar
              }
            }
          }
        })
      `
    }
  }
})

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
  babelOptions: {
    filename: '/ws/dummy/index.js'
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
        trimObjects: [{
          functionName: 'createProject',
          magicImports: ['startupjs/registry', '@startupjs/registry'],
          targetObjectJsonPath: '$.plugins.*',
          ensureOnlyKeys: ['client', 'isomorphic', 'server', 'build'],
          keepKeys: ['client']
        }]
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
        trimObjects: [{
          functionName: 'createProject',
          magicImports: ['startupjs/registry', '@startupjs/registry'],
          targetObjectJsonPath: '$.plugins.*',
          ensureOnlyKeys: ['client', 'isomorphic', 'server', 'build'],
          keepKeys: ['client']
        }]
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
        trimObjects: [{
          functionName: 'createProject',
          magicImports: ['startupjs/registry', '@startupjs/registry'],
          targetObjectJsonPath: '$.plugins.*',
          ensureOnlyKeys: ['client', 'isomorphic', 'server', 'build'],
          keepKeys: ['client', 'isomorphic']
        }]
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
    },
    // Removing keys from object within default export of the magic filename
    'object in default export of magic filename. Keep keys `client` and `isomorphic`': {
      pluginOptions: {
        trimObjects: [{
          magicFilenameRegex: /startupjs\.config\.js/,
          magicExport: 'default',
          targetObjectJsonPath: '$.modules.*',
          ensureOnlyKeys: ['client', 'isomorphic', 'server', 'build'],
          keepKeys: ['client', 'isomorphic']
        }, {
          magicFilenameRegex: /startupjs\.config\.js/,
          magicExport: 'default',
          targetObjectJsonPath: '$.plugins.*',
          ensureOnlyKeys: ['client', 'isomorphic', 'server', 'build'],
          keepKeys: ['client', 'isomorphic']
        }, {
          magicFilenameRegex: /startupjs\.config\.js/,
          magicExport: 'default',
          targetObjectJsonPath: '$',
          ensureOnlyKeys: ['plugins', 'modules', 'client', 'isomorphic', 'server', 'build'],
          keepKeys: ['plugins', 'modules', 'client', 'isomorphic']
        }]
      },
      babelOptions: {
        filename: '/ws/dummy/startupjs.config.js'
      },
      code: /* js */`
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

        export default {
          isomorphic: {
            allowUnusedPlugins: true,
            server: true
          },
          server: {
            init: options => ({
              api: expressApp => {
                expressApp.get('/hello', (req, res) => {
                  res.send('Hello from server')
                })
              }
            })
          },
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
        }
      `
    },
    // Removing keys from object within default export of the magic filename
    'transform function calls': {
      pluginOptions: {
        transformFunctionCalls: [{
          // direct named exports of aggregation() within model/*.js files
          // are replaced with aggregationHeader() calls.
          // 'collection' is the filename without extension
          // 'name' is the direct named export const name
          //
          // Example:
          //
          //   // in model/games.js
          //   export const $$byGameId = aggregation(({ gameId }) => ({ gameId }))
          //
          // will be replaced with:
          //
          //   __aggregationHeader({ collection: 'games', name: '$$byGameId' })
          //
          functionName: 'aggregation',
          magicImports: ['@startupjs/orm', 'startupjs/orm'],
          requirements: {
            argumentsAmount: 1,
            directNamedExportedAsConst: true
          },
          throwIfRequirementsNotMet: true,
          replaceWith: {
            newFunctionNameFromSameImport: '__aggregationHeader',
            newCallArgumentsTemplate: `[
              {
                collection: %%filenameWithoutExtension%%,
                name: %%directNamedExportConstName%%
              }
            ]`
          }
        }, {
          // remove accessControl() calls (replace with undefined)
          functionName: 'accessControl',
          magicImports: ['@startupjs/orm', 'startupjs/orm'],
          replaceWith: {
            remove: true // replace the whole function call with undefined
          }
        }]
      },
      babelOptions: {
        filename: '/ws/dummy/model/games.js'
      },
      code: /* js */`
        import { aggregation, BaseModel, accessControl } from 'startupjs/orm'
        import { getAppName, getRoleId, DEFAULT_USER_ID } from 'server-lib'

        const appName = getAppName()
        const adminRoleId = getRoleId('admin')

        export const access = accessControl({
          create: (doc, { session }) => session.roleId === adminRoleId,
          read: () => true,
          update: (doc, { session }) => session.roleId === adminRoleId || !doc.readonly,
          delete: (doc, { session }) => session.roleId === adminRoleId
        })

        export const $$createdByUser = aggregation(({ userId = DEFAULT_USER_ID }) => ({
          userId,
          $sort: { createdAt: -1 },
          appName
        }))

        export default class GamesModel extends BaseModel {
          async addNew () {
            await this.add({ name: 'New Game' })
          }
        }
      `
    },
    'transform function calls with more complex js logic (for aggregation)': {
      pluginOptions: {
        transformFunctionCalls: [{
          // export default inside of aggregation() within a separate model/*.$$myAggregation.js files
          // are replaced with aggregationHeader() calls.
          // Filepath is stripped of the extensions and split into sections (by dots and slashes)
          // 'name' is the last section.
          // 'collection' is the section before it.
          //
          // Example:
          //
          //   // in model/games/$$active.js
          //   export default aggregation(({ gameId }) => ({ gameId }))
          //
          // will be replaced with:
          //
          //   __aggregationHeader({ collection: 'games', name: '$$active' })
          //
          functionName: 'aggregation',
          magicImports: ['@startupjs/orm', 'startupjs/orm'],
          requirements: {
            argumentsAmount: 1,
            directDefaultExported: true
          },
          throwIfRequirementsNotMet: true,
          replaceWith: {
            newFunctionNameFromSameImport: '__aggregationHeader',
            newCallArgumentsTemplate: `[
              {
                collection: %%folderAndFilenameWithoutExtension%%.split(/[\\\\/\\.]/).at(-2),
                name: %%folderAndFilenameWithoutExtension%%.split(/[\\\\/\\.]/).at(-1)
              }
            ]`
          }
        }]
      },
      babelOptions: {
        filename: '/ws/dummy/model/games/$$active.js'
      },
      code: /* js */`
        import { aggregation } from 'startupjs/orm'
        import { getAppName, DEFAULT_USER_ID } from 'server-lib'

        const appName = getAppName()

        export default aggregation(({ userId = DEFAULT_USER_ID }) => ({
          userId,
          $sort: { createdAt: -1 },
          appName
        }))
      `
    },
    'transform function calls with manipulation of arguments': {
      pluginOptions: {
        transformFunctionCalls: [{
          // this tests that the previous transformation is not applied to this call
          // (because it has different requirements)
          functionName: 'aggregation',
          magicImports: ['@startupjs/orm', 'startupjs/orm'],
          requirements: {
            argumentsAmount: 1,
            directNamedExportedAsConst: true
          },
          replaceWith: {
            newFunctionNameFromSameImport: '__aggregationHeader',
            newCallArgumentsTemplate: `[
              {
                collection: %%filenameWithoutExtension%%,
                name: %%directNamedExportConstName%%
              }
            ]`
          }
        }, {
          // any other calls to aggregation() must explicitly define the collection and name
          // as the second argument. If not, the build will fail.
          //
          // Example:
          //
          //   aggregation(
          //     ({ gameId }) => ({ gameId }),
          //     { collection: 'games', name: 'byGameId' }
          //   )
          //
          // will be replaced with:
          //
          //   __aggregationHeader({ collection: 'games', name: 'byGameId' })
          //
          functionName: 'aggregation',
          magicImports: ['@startupjs/orm', 'startupjs/orm'],
          requirements: {
            argumentsAmount: 2
          },
          throwIfRequirementsNotMet: true,
          replaceWith: {
            newFunctionNameFromSameImport: '__aggregationHeader',
            newCallArgumentsTemplate: '[%%argument1%%]' // 0-based index
          }
        }]
      },
      babelOptions: {
        filename: '/ws/dummy/model/-helpers/aBunchOfAggregations.js'
      },
      code: /* js */`
        import { aggregation } from 'startupjs/orm'
        import { getAppName, DEFAULT_USER_ID } from 'server-lib'

        const appName = getAppName()

        export const $$gamesByUserId = aggregation(({ userId = DEFAULT_USER_ID }) => ({
          userId,
          $sort: { createdAt: -1 },
          appName
        }), { collection: 'games', name: '$$byUserId' })
      `
    }
  }
})

import { createPlugin } from 'startupjs/registry'
import { serveStaticPromo } from '../server'
import { redirectToPromoIfNotLoggedIn } from '../client'

export default createPlugin({
  name: 'serve-static-promo',
  for: 'startupjs',
  server: ({ testServer = 'default' }) => ({
    api (expressApp) {
      console.log({ testServer })
      expressApp.use(serveStaticPromo())
    }
  }),
  client: ({
    autoFilterHome = true,
    redirectUrl,
    permissionsFilter,
    testClient = 'default'
  }) => ({
    modifyRoute (route) {
      console.log({ testClient }, 'modifyRoute')
      if (!autoFilterHome) return
      if (route.path === '/') {
        return {
          ...route,
          filters: [redirectToPromoIfNotLoggedIn(redirectUrl), ...(route.filters || [])]
        }
      }
    },
    routes (pages) {
      console.log({ testClient }, 'routes')
      return [{
        path: '/promo',
        source: {
          type: 'module',
          moduleName: 'serve-static-promo'
        },
        exact: true,
        filters: [permissionsFilter],
        component: pages.PPermission
      }]
    }
  })
})

import { createPlugin } from 'startupjs/registry'
import { serveStaticPromo } from './server/index.js'
import { redirectToPromoIfNotLoggedIn } from './client/index.js'

export default createPlugin({
  name: 'serve-static-promo',
  for: 'startupjs',
  server: ({ testServer = 'default' }) => ({
    api (expressApp) {
      console.log({ testServer })
      console.log('> plugin: serve-static-promo')
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
    renderSidebarBlock: () => {

    }
  })
})

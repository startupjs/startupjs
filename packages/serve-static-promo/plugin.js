import { createPlugin } from 'startupjs/registry'
import { serveStaticPromo } from './server/index.js'
import { redirectToPromoIfNotLoggedIn } from './client/index.js'

export default createPlugin({
  name: 'serve-static-promo',
  server: () => ({
    api (expressApp) {
      expressApp.use(serveStaticPromo())
    }
  }),
  client: ({
    autoFilterHome = true,
    redirectUrl,
    permissionsFilter
  }) => ({
    // TODO
    modifyRoute (route) {
      if (!autoFilterHome) return
      if (route.path === '/') {
        return {
          ...route,
          filters: [redirectToPromoIfNotLoggedIn(redirectUrl), ...(route.filters || [])]
        }
      }
    }
  })
})

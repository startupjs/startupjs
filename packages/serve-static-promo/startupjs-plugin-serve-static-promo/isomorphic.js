import { redirectToPromoIfNotLoggedIn } from '../isomorphic'

export default ({
  autoFilterHome = true,
  redirectUrl,
  permissionsFilter
}) => ({
  modifyRoute (route) {
    if (!autoFilterHome) return
    if (route.path === '/') {
      return {
        ...route,
        filters: [redirectToPromoIfNotLoggedIn(redirectUrl), ...(route.filters || [])]
      }
    }
  },
  routes (pages) {
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

// import { redirectToPromoIfNotLoggedIn } from '@dmapper/serve-static-promo/isomorphic'
import registry from '@startupjs/registry'
// import aPlugin from '@dmapper/serve-static-promo/startupjs-plugin/isomorphic'
// import options from 'path/to/main/options'

// const options = options()
registry.registerModule('serve-static-promo')
registry.registerPlugin('startupjs', 'serve-static-promo')

export default () => ({
  dependencies: {
    'serve-static-promo': {
      options: {
        redirectUrl: '/promo'
      }
      // overrides: ({ autoFilterHome, redirectUrl }) => ({
      //   modifyRoute (route) {
      //     console.log('Custom override!')
      //     if (!autoFilterHome) return
      //     if (route.path === '/') {
      //       return {
      //         ...route,
      //         filters: [redirectToPromoIfNotLoggedIn(redirectUrl), ...(route.filters || [])]
      //       }
      //     }
      //   }
      // })
    }
    // i18n: {
    //   options: {
    //     permissionsFilter: () => {
    //       return true
    //     }
    //   }
    // },
    // permissions: {
    //   options: {
    //     roles: ['Admin', 'User'],
    //     permissions: {
    //       Admin: ['editAdminPanel', 'addNewUsers']
    //     }
    //   }
    // }
  }
})

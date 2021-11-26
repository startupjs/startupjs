export default () => {
  return {
    redirectUrl: '/promo'
    // overrides: options => ({
    //   modifyRoute (route) {
    //     console.log('Custom override!')
    //     if (!options.autoFilterHome) return
    //     if (route.path === '/') {
    //       return {
    //         ...route,
    //         filters: [redirectToPromoIfNotLoggedIn(options.redirectUrl), ...(route.filters || [])]
    //       }
    //     }
    //   }
    // })
  }
}

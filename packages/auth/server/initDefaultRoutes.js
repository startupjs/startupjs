import { LOGOUT_URL } from '../isomorphic/constants'

export default function initDefaultRoutes (router, config) {
  const { onBeforeLogoutHook, signInPageUrl } = config

  router.get(LOGOUT_URL, function (req, res) {
    onBeforeLogoutHook(
      req,
      res,
      () => {
        delete req.session.loggedIn
        delete req.session.userId
        req.logout()
        res.redirect(signInPageUrl)
      })
  })
}

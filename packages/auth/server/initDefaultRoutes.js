import { LOGOUT_URL } from '../isomorphic/constants.js'

export default function initDefaultRoutes (router, config) {
  const { onBeforeLogoutHook, signInPageUrl } = config

  router.get(LOGOUT_URL, function (req, res, next) {
    onBeforeLogoutHook(
      req,
      res,
      () => {
        delete req.session.loggedIn
        delete req.session.userId

        req.logout((err) => {
          if (err) return next(err)
          res.redirect(signInPageUrl)
        })
      })
  })
}

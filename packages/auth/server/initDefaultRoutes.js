import { LOGOUT_URL, SIGN_IN_URL, DEFAUL_SUCCESS_REDIRECT_URL } from '../isomorphic/constants'

export default function initDefaultRoutes (router, config) {
  const { onBeforeLogoutHook } = config

  router.get(LOGOUT_URL, function (req, res) {
    onBeforeLogoutHook(
      { userId: req.session.userId },
      req,
      res,
      () => {
        delete req.session.loggedIn
        delete req.session.userId
        req.logout()
        res.redirect(SIGN_IN_URL)
      })
  })

  router.get(DEFAUL_SUCCESS_REDIRECT_URL, function (req, res) {
    res.send(`
      <p>Authorization successful!</p>
      <p>You will be redirected back in just a second.</p>
      <script>setTimeout(function(){window.location.href = '/'}, 100)</script>
    `)
  })
}

import { LOGOUT_URL, SIGN_IN_URL, DEFAUL_SUCCESS_REDIRECT_URL } from '../isomorphic/constants'

export default function initDefaultRoutes (router, config) {
  const { onLogin, onLogout } = config

  router.get(LOGOUT_URL, function (req, res) {
    onLogout && onLogout(req.session.userId)

    delete req.session.loggedIn
    delete req.session.userId
    req.logout()
    res.redirect(SIGN_IN_URL)
  })

  router.get(DEFAUL_SUCCESS_REDIRECT_URL, function (req, res) {
    onLogin && onLogin(req.session.userId)
    res.send(`
      <p>Authorization successful!</p>
      <p>You will be redirected back in just a second.</p>
      <script>setTimeout(function(){window.location.href = '/'}, 100)</script>
    `)
  })
}

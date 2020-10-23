import { LOGOUT_URL, AUTHENTICATED_URL } from '../isomorphic/constants'

export default function initDefaultRoutes (router) {
  router.get(LOGOUT_URL, function (req, res) {
    delete req.session.loggedIn
    delete req.session.userId
    req.logout()
    res.redirect('/')
  })
  router.get(AUTHENTICATED_URL, function (req, res) {
    res.send(`
      <p>Authorization successful!</p>
      <p>You will be redirected back in just a second.</p>
      <script>setTimeout(function(){window.location.href = '/'}, 100)</script>
    `)
  })
}

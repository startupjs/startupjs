export default function (router) {
  router.get('/auth/logout', function (req, res) {
    delete req.session.loggedIn
    delete req.session.userId
    req.logout()
    res.redirect('/')
  })
}

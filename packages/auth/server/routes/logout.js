export default function (auth) {
  const { router } = auth
  router.get('/auth/logout', function (req, res) {
    delete req.session.loggedIn
    delete req.session.userId
    req.logout()
    res.redirect('/')
  })
}

export default function ensureAuthenticated (req, res, next) {
  const loggedIn = req.isAuthenticated()

  const $session = req.model.scope('_session')
  if (loggedIn) {
    req.session.loggedIn = true
    $session.set('loggedIn', loggedIn)
  } else {
    delete req.session.loggedIn
    $session.del('loggedIn')

    return next()
  }

  if (!req.session.passport.user) throw new Error('No passport user')
  if (req.session.userId !== req.session.passport.user) {
    req.session.userId = req.session.passport.user
    $session.set('_session.userId', req.session.userId)
  }

  if (req.method === 'GET') {
    const redirectUrl = req.session.redirectUrl
    if (redirectUrl) {
      delete req.session.redirectUrl
      return res.redirect(redirectUrl)
    }
  }

  next()
}

// Middleware that prepare auth info for every route
// And set userId + isLogged ind to server and client sessions
export default function setAuthInfo (req, res, next) {
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

  // Update user id right after login from anon (unauthorised) session
  if (req.session.userId !== req.session.passport.user) {
    req.session.userId = req.session.passport.user
    $session.set('_session.userId', req.session.userId)
  }

  next()
}

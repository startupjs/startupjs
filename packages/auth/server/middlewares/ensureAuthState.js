// Middleware that prepare auth info for every route
// And set userId + isLogged ind to server and client sessions
export default function ensureAuthState (req, res, next) {
  const loggedIn = req.isAuthenticated()

  const $session = req.model.scope('_session')

  if (loggedIn) {
    req.session.loggedIn = true
    $session.set('loggedIn', loggedIn)

    // Patch session userId with passport data
    if (req.session.passport && req.session.passport.user) {
      req.session.userId = req.session.passport.user
      $session.set('userId', req.session.userId)
    }
  } else {
    delete req.session.loggedIn
    $session.del('loggedIn')

    return next()
  }

  next()
}

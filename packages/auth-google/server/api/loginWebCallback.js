import { finishAuth } from '@startupjs/auth/server'
import passport from 'passport'

export default function loginWebCallback (req, res, next, config) {
  const { successRedirectUrl, onBeforeLoginHook } = config
  // const { code } = req.query

  // If it's authorized session -> patch auth doc with new account
  if (req.session.loggedIn) {
  } else {
    passport.authenticate('google', function (err, userId) {
      if (err) {
        console.log('[@startup/auth-google] Error:', err)
        res.status(500).json({ error: err })
      }

      finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
    })(req, res, next)
  }
}

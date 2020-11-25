import { finishAuth } from '@startupjs/auth/server'
import passport from 'passport'

export default function loginWebCallback (req, res, next, config) {
  const { successRedirectUrl, onLoginFinishHook, onLoginStartHook } = config

  passport.authenticate('google', function (err, userId) {
    if (err) {
      console.log('[@startup/auth-google] Error:', err)
      res.status(500).json({ error: err })
    }

    finishAuth(req, res, { userId, successRedirectUrl, onLoginFinishHook, onLoginStartHook })
  })(req, res, next)
}

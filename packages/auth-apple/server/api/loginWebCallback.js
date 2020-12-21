import { finishAuth } from '@startupjs/auth/server'
import passport from 'passport'

export default function loginWebCallback (req, res, next, config) {
  const { successRedirectUrl, onBeforeLoginHook } = config

  passport.authenticate('apple', function (err, userId) {
    if (err) {
      console.log('[@startup/auth-apple] Error:', err)
      res.status(500).json({ error: err })
    }
    finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
  })(req, res, next)
}

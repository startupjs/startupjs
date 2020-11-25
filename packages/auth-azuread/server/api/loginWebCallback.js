import { finishAuth } from '@startupjs/auth/server'
import passport from 'passport'

export default function callBackLogin (req, res, next, config) {
  const { successRedirectUrl, onLoginFinishHook, onLoginStartHook } = config

  passport.authenticate('azuread-openidconnect', function (err, userId, info) {
    if (err) {
      console.log('[@startup/auth-linkedin] Error:', err)
      res.status(500).json({ error: err })
    }

    finishAuth(req, res, { userId, successRedirectUrl, onLoginFinishHook, onLoginStartHook })
  })(req, res, next)
}

import { finishAuth } from '@startupjs/auth/server'
import passport from 'passport'

export default function callBackLogin (req, res, next, config) {
  const { successRedirectUrl, onBeforeLogintHook } = config

  passport.authenticate('linkedin', function (err, userId, info) {
    if (err) {
      console.log('[@startup/auth-linkedin] Error:', err)
      res.status(500).json({ error: err })
    }

    finishAuth(req, res, { userId, successRedirectUrl, onBeforeLogintHook })
  })(req, res, next)
}

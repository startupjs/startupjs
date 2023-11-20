import { finishAuth } from '@startupjs/auth/server/index.js'
import passport from 'passport'

export default function callBackLogin (req, res, next, config) {
  const { onBeforeLoginHook } = config

  passport.authenticate('linkedin', function (err, userId, info) {
    if (err) {
      console.log('[@startup/auth-linkedin] Error:', err)
      res.status(500).json({ error: err })
    }

    finishAuth(req, res, { userId, onBeforeLoginHook })
  })(req, res, next)
}

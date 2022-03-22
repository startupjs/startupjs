import { finishAuth } from '@startupjs/auth/server'
import passport from 'passport'

export default function callBackLogin (req, res, next, config) {
  const { onBeforeLoginHook } = config

  passport.authenticate('lti', function (error, userId) {
    if (error) {
      console.log('[@startup/auth-lti] Error:', error)
      res.status(500).json({ error })
    }

    finishAuth(req, res, { userId, onBeforeLoginHook })
  })(req, res, next)
}

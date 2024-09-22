import { finishAuth } from '@startupjs/auth/server/index.js'
import passport from 'passport'

export default function loginCallback (req, res, next, config) {
  const { onBeforeLoginHook } = config

  passport.authenticate(config.providerName, function (err, userId, info) {
    if (err) {
      console.log('[@startup/auth-common] Error:', err)
      res.status(500).json({ error: err })
    }

    finishAuth(req, res, { userId, onBeforeLoginHook })
  })(req, res, next)
}

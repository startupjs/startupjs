import { finishAuth } from '@startupjs/auth/server'
import passport from 'passport'

export default function callBackLogin (req, res, next, config) {
  const { successRedirectUrl, onBeforeLoginHook } = config

  passport.authenticate('azuread-idecisiongames', function (err, userId, info) {
    if (err) {
      console.log('[@startup/auth-idg] Error:', err)
      res.status(500).json({ error: err })
    }

    finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
  })(req, res, next)
}

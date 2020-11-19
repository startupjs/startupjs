import passport from 'passport'
import { finishAuth } from '@startupjs/auth/server'

export default function callBackLogin (req, res, next, { successRedirectUrl }) {
  passport.authenticate('azuread-openidconnect', function (err, userId, info) {
    if (err) {
      console.log('[@startup/auth-linkedin] Error:', err)
      res.status(500).json({ error: err })
    }

    finishAuth(req, res, { userId, successRedirectUrl })
  })(req, res, next)
}

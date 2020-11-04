import passport from 'passport'
import { finishAuth } from '@startupjs/auth/server'

export default function callBackLogin (req, res, done) {
  passport.authenticate('azuread-openidconnect', function (err, userId, info) {
    if (err) {
      console.log('[@startup/auth-linkedin] Error:', err)
      res.status(500).json({ error: err })
    }
    finishAuth(req, res, userId)
  })(req, res, done)
}

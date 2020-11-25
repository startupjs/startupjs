import { finishAuth } from '@startupjs/auth/server'
import passport from 'passport'

export default function login (req, res, next, { successRedirectUrl }) {
  passport.authenticate('local', function (err, userId, info) {
    if (err) {
      console.log('[@startup/auth-local] Error:', err)
      return next(err)
    }

    finishAuth(req, res, { userId, successRedirectUrl })
  })(req, res, next)
}

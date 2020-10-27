import passport from 'passport'
import { finishAuth } from '@startupjs/auth/server'

export default function login (req, res, done) {
  passport.authenticate('local', function (err, userId, info) {
    if (err) {
      console.log('[@startup/auth-local] Error:', err)
      return done(err)
    }
    finishAuth(req, res, userId)
  })(req, res, done)
}

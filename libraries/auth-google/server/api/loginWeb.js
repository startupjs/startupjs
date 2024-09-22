import passport from 'passport'
import { PERMISSIONS } from '../../isomorphic/index.js'

export default function loginWeb (req, res, next) {
  return passport.authenticate('google', {
    scope: PERMISSIONS,
    prompt: 'select_account',
    ...req.query
  })(req, res, next)
}

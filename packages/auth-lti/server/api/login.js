import passport from 'passport'
import { CALLBACK_URL } from '../../isomorphic'

export default function (config) {
  return passport.authenticate('lti', {
    ...config,
    callbackURL: CALLBACK_URL
  })
}

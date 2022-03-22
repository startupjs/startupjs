import passport from 'passport'

export default function (config) {
  return passport.authenticate('lti', config)
}

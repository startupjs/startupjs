import passport from 'passport'

export default passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
})

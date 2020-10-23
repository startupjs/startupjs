import passport from 'passport'

export default function loginWeb () {
  return passport.authenticate('linkedin')
}

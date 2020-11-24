import passport from 'passport'
import { PERMISSIONS } from '../../isomorphic'

export default passport.authenticate('google', {
  scope: PERMISSIONS,
  prompt: 'select_account'
})

import passport from 'passport'
import { PERMISSIONS } from '../../isomorphic/constants'

export default passport.authenticate('facebook', {
  scope: PERMISSIONS
})

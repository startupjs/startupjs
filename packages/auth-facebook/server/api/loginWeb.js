import passport from 'passport'
import { PERMISSIONS } from '../../isomorphic/constants.js'

export default passport.authenticate('facebook', {
  scope: PERMISSIONS
})

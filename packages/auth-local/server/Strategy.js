import { Strategy } from 'passport-local'
import _get from 'lodash/get'
import passport from 'passport'
import bcrypt from 'bcrypt'
import {
  onCreatePasswordResetSecret,
  onBeforeRegister,
  onAfterRegister,
  onBeforePasswordReset,
  onAfterPasswordReset,
  onBeforePasswordChange,
  onAfterPasswordChange
} from './helpers'
import initRoutes from './initRoutes'
import Provider from './Provider'
import { DEFAULT_PASS_RESET_TIME_LIMIT } from '../isomorphic'

export default function (config = {}) {
  this.config = {}

  return ({ model, router, authConfig }) => {
    Object.assign(this.config, {
      resetPasswordTimeLimit: DEFAULT_PASS_RESET_TIME_LIMIT,
      onCreatePasswordResetSecret,
      onBeforeRegister,
      onAfterRegister,
      onAfterPasswordReset,
      onBeforePasswordReset,
      onBeforePasswordChange,
      onAfterPasswordChange,
      ...authConfig
    }, config)

    console.log('++++++++++ Initialization of Local auth strategy ++++++++++\n', this.config, '\n')

    initRoutes({ router, config: this.config })

    passport.use(
      new Strategy(
        { usernameField: 'email' },
        async (email = '', password, cb) => {
          const provider = new Provider(model, { email }, this.config)

          const authData = await provider.loadAuthData()
          if (!authData) return cb(null, false, { message: 'User not found' })

          const hash = _get(authData, 'providers.local.hash')
          const userId = await provider.findOrCreateUser()
          bcrypt.compare(password, hash, function (err, res) {
            if (err) return cb(err)
            if (res === false) {
              return cb(null, false, { message: 'Invalid email or password' })
            }
            return cb(null, userId)
          })
        }
      )
    )
  }
}

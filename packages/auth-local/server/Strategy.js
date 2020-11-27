import { Strategy } from 'passport-local'
import _get from 'lodash/get'
import passport from 'passport'
import bcrypt from 'bcrypt'
import initRoutes from './initRoutes'
import Provider from './Provider'

export default function (config = {}) {
  this.config = {}

  return ({ model, router, authConfig }) => {
    Object.assign(this.config, {
      resetPasswordTimeLimit: 60 * 1000 * 10, // Expire time of reset password secret (10 mins by default),
      onCreatePasswordResetSecret: () => {}, // cb that triggers after reset password secret creating,
      onPasswordReset: () => {}, // cb that triggers after reset password operation,
      onPasswordChange: () => {}, // cb that triggers after change password operation
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

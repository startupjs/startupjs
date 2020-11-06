import Provider from './Provider'
import { Strategy } from 'passport-local'
import _get from 'lodash/get'
import initRoutes from './initRoutes'
import passport from 'passport'
import bcrypt from 'bcrypt'
import { sendRecoveryConfirmation } from './heplers'

export default function (config = {}) {
  this.config = {}

  Object.assign(this.config, {
    resetPasswordTimeLimit: 60 * 1000 * 1000, // Expire time of reset password secret,
    sendRecoveryConfirmation // cb that triggers after reset password secret creating
  }, config)

  return ({ model, router }) => {
    console.log('++++++++++ Initialization of Local auth strategy ++++++++++\n', this.config, '\n')

    initRoutes({ router, config: this.config })

    passport.use(
      new Strategy(
        {
          usernameField: 'email'
        },
        async function (email = '', password, cb) {
          const provider = new Provider(model, { email })

          const authData = await provider.loadAuthData()
          if (!authData) return cb(null, false, { message: 'User not found' })

          const hash = _get(authData, 'providers.local.hash')
          const userId = await provider.findOrCreateUser()
          bcrypt.compare(password, hash, function (err, res) {
            if (err) return cb(err)
            if (res === false) {
              return cb(null, false, { message: '[@startup/auth-local] Invalid password' })
            }
            return cb(null, userId)
          })
        }
      )
    )
  }
}

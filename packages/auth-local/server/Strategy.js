import { Strategy } from 'passport-local'
import _get from 'lodash/get'
import passport from 'passport'
import bcrypt from 'bcrypt'
import {
  onBeforeCreatePasswordResetSecret,
  onCreatePasswordResetSecret,
  onBeforeRegister,
  onAfterRegister,
  onBeforePasswordReset,
  onAfterPasswordReset,
  onBeforePasswordChange,
  onAfterPasswordChange,
  onCreateEmailChangeSecret,
  onBeforeCreateEmailChangeSecret,
  onBeforeEmailChange,
  onAfterEmailChange
} from './helpers'
import initRoutes from './initRoutes'
import Provider from './Provider'
import { DEFAULT_PASS_RESET_TIME_LIMIT } from '../isomorphic'

export default function (config = {}) {
  this.config = {}

  const func = ({ router, updateClientSession, authConfig }) => {
    Object.assign(this.config, {
      resetPasswordTimeLimit: DEFAULT_PASS_RESET_TIME_LIMIT,
      localSignUpEnabled: true,
      onBeforeCreatePasswordResetSecret,
      onCreatePasswordResetSecret,
      onBeforeRegister,
      onAfterRegister,
      onAfterPasswordReset,
      onBeforePasswordReset,
      onBeforePasswordChange,
      onAfterPasswordChange,
      onBeforeCreateEmailChangeSecret,
      onCreateEmailChangeSecret,
      onBeforeEmailChange,
      onAfterEmailChange,
      ...authConfig
    }, config)

    console.log('++++++++++ Initialization of Local auth strategy ++++++++++\n')

    initRoutes({ router, config: this.config })

    // Append required configs to client session
    updateClientSession({ local: { localSignUpEnabled: this.config.localSignUpEnabled } })

    passport.use(
      new Strategy(
        {
          usernameField: 'email',
          passReqToCallback: true
        },
        async (req, email = '', password, cb) => {
          email = email.trim().toLowerCase()
          const model = req.model
          const provider = new Provider(model, { email }, this.config)

          const authData = await provider.loadAuthData()
          if (!authData) return cb(null, false, { message: 'User not found' })

          const hash = _get(authData, 'providers.local.hash', '')
          const userId = await provider.findOrCreateUser({ req })

          await normalizeProvider(userId, model)

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

  func.providerName = 'local'
  return func
}

// Generally we don't need an provider id to perform auth
// auth proces depends on provider.email field only
// but earlier implementation of auth lib used provideer.id in local strategy
// Those lines is added only for backward compabilities reasons
async function normalizeProvider (userId, model) {
  const $auth = model.scope(`auths.${userId}`)
  await $auth.subscribe()

  const authLocalProvider = $auth.get('providers.local')

  if (authLocalProvider.id && !authLocalProvider.email) {
    await $auth.set('providers.local.email', authLocalProvider.id)
  }

  if (authLocalProvider.email && !authLocalProvider.id) {
    await $auth.set('providers.local.id', authLocalProvider.email)
  }

  $auth.unsubscribe()
}

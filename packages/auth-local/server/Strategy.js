import { Strategy } from 'passport-local'
import _get from 'lodash/get'
import passport from 'passport'
import bcrypt from 'bcrypt'
import {
  confirmEmail,
  onAfterEmailChange,
  onAfterPasswordChange,
  onAfterPasswordReset,
  onAfterRegister,
  onBeforeConfirmRegistration,
  onBeforeCreateEmailChangeSecret,
  onBeforeCreatePasswordResetSecret,
  onBeforeEmailChange,
  onCreateEmailChangeSecret,
  onBeforePasswordChange,
  onBeforePasswordReset,
  onCreatePasswordResetSecret,
  onBeforeRegister,
  sendRegistrationConfirmation,
  sendRegistrationConfirmationComplete,
  sendRegistrationInfo
} from './helpers'
import initRoutes from './initRoutes'
import Provider from './Provider'
import {
  DEFAULT_CONFIRM_EMAIL_TIME_LIMIT,
  DEFAULT_PASS_RESET_TIME_LIMIT
} from '../isomorphic'

export default function (config = {}) {
  this.config = {}

  const func = ({ model, router, updateClientSession, authConfig }) => {
    Object.assign(this.config, {
      confirmEmailTimeLimit: DEFAULT_CONFIRM_EMAIL_TIME_LIMIT,
      confirmRegistration: false,
      localSignUpEnabled: true,
      registrationConfirmedUrl: '/registrationconfirmed',
      resetPasswordTimeLimit: DEFAULT_PASS_RESET_TIME_LIMIT,
      confirmEmail,
      onAfterEmailChange,
      onAfterPasswordChange,
      onAfterPasswordReset,
      onAfterRegister,
      onBeforeConfirmRegistration,
      onBeforeCreateEmailChangeSecret,
      onBeforeCreatePasswordResetSecret,
      onBeforeEmailChange,
      onBeforePasswordChange,
      onBeforePasswordReset,
      onBeforeRegister,
      onCreateEmailChangeSecret,
      onCreatePasswordResetSecret,
      sendRegistrationConfirmation,
      sendRegistrationConfirmationComplete,
      sendRegistrationInfo,
      ...authConfig
    }, config)

    console.log('++++++++++ Initialization of Local auth strategy ++++++++++\n')

    initRoutes({ router, config: this.config })

    // Append required configs to client session
    updateClientSession({ local: {
      localSignUpEnabled: this.config.localSignUpEnabled,
      confirmRegistration: this.config.confirmRegistration
    } })

    passport.use(
      new Strategy(
        {
          usernameField: 'email',
          passReqToCallback: true
        },
        async (req, email = '', password, cb) => {
          email = email.trim().toLowerCase()
          const provider = new Provider(model, { email }, this.config)

          const authData = await provider.loadAuthData()
          if (!authData) return cb('User not found')

          if (this.config.confirmRegistration && authData.providers.local.unconfirmed) {
            return cb('User email not confirmed. Check your email and confirm registration')
          }

          const hash = _get(authData, 'providers.local.hash', '')
          const userId = await provider.findOrCreateUser({ req })

          await normalizeProvider(userId, model)

          bcrypt.compare(password, hash, function (err, res) {
            if (err) return cb(err)
            if (res === false) {
              return cb('Invalid email or password')
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

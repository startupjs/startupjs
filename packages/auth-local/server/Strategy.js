import { CONFIRMED_EMAIL_URL } from '@startupjs/auth/isomorphic'
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
  onBeforeRegister,
  onBeforeResendConfirmation,
  onCreatePasswordResetSecret,
  sendRegistrationConfirmation,
  sendRegistrationConfirmationComplete,
  sendRegistrationInfo
} from './helpers'
import initRoutes from './initRoutes'
import Provider from './Provider'
import {
  DEFAULT_CONFIRM_EMAIL_TIME_LIMIT,
  DEFAULT_PASS_RESET_TIME_LIMIT,
  ERROR_USER_INVALID_CREDENTIALS,
  ERROR_USER_NOT_CONFIRMED,
  ERROR_USER_NOT_FOUND
} from '../isomorphic'

export default function (config = {}) {
  this.config = {}

  const func = ({ model, router, updateClientSession, authConfig }) => {
    Object.assign(this.config, {
      confirmEmailTimeLimit: DEFAULT_CONFIRM_EMAIL_TIME_LIMIT,
      confirmRegistration: false,
      localSignUpEnabled: true,
      registrationConfirmedUrl: CONFIRMED_EMAIL_URL,
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
      onBeforeResendConfirmation,
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
          const model = req.model
          email = email.trim().toLowerCase()
          const provider = new Provider(model, { email }, this.config)

          const authData = await provider.loadAuthData()
          if (!authData) return cb(ERROR_USER_NOT_FOUND)

          const hash = _get(authData, 'providers.local.hash', '')
          const userId = await provider.findOrCreateUser({ req })

          await normalizeProvider(userId, model)

          bcrypt.compare(password, hash, (err, res) => {
            if (err) return cb(err)
            if (res === false) {
              return cb(ERROR_USER_INVALID_CREDENTIALS)
            }
            if (
              this.config.confirmRegistration
              && authData.providers.local.confirmationExpiresAt
            ) {
              return cb(ERROR_USER_NOT_CONFIRMED)
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

import { loginLockChecker } from '@startupjs/auth/server'
import {
  CHANGE_EMAIL_URL,
  CHANGE_PASSWORD_URL,
  CONFIRM_REGISTRATION_URL,
  CREATE_EMAIL_CHANGE_SECRET_URL,
  CREATE_PASS_RESET_SECRET_URL,
  LOCAL_LOGIN_URL,
  REGISTER_URL,
  RESEND_EMAIL_CONFIRMATION,
  RESET_PASSWORD_URL,
} from '../isomorphic'
import {
  changePassword,
  changeEmail,
  confirmRegistration,
  createEmailChangeSecret,
  createPasswordResetSecret,
  login,
  register,
  resendEmailConfirmation,
  resetPassword
} from './api'
import { setLoginAttempts } from './middlewares'

export default function (options) {
  const { router, config } = options

  router.get(CONFIRM_REGISTRATION_URL, confirmRegistration(config)) // web route
  router.post(CHANGE_EMAIL_URL, changeEmail(config))
  router.post(CHANGE_PASSWORD_URL, changePassword(config))
  router.post(CREATE_EMAIL_CHANGE_SECRET_URL, createEmailChangeSecret(config))
  router.post(CREATE_PASS_RESET_SECRET_URL, createPasswordResetSecret(config))
  router.post(LOCAL_LOGIN_URL, loginLockChecker, setLoginAttempts, login(config))
  router.post(REGISTER_URL, register(config))
  router.post(RESEND_EMAIL_CONFIRMATION, resendEmailConfirmation(config))
  router.post(RESET_PASSWORD_URL, resetPassword(config))
}

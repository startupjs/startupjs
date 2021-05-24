import { loginLockChecker } from '@startupjs/auth/server'
import {
  LOCAL_LOGIN_URL,
  REGISTER_URL,
  CREATE_PASS_RESET_SECRET_URL,
  RESET_PASSWORD_URL,
  CHANGE_PASSWORD_URL,
  CREATE_EMAIL_CHANGE_SECRET_URL,
  CHANGE_EMAIL_URL
} from '../isomorphic'
import {
  login,
  register,
  createPasswordResetSecret,
  resetPassword,
  changePassword,
  createEmailChangeSecret,
  changeEmail
} from './api'
import { setLoginAttempts } from './middlewares'

export default function (options) {
  const { router, config } = options

  router.post(
    LOCAL_LOGIN_URL,
    loginLockChecker,
    setLoginAttempts,
    (req, res, done) => login(req, res, done, config)
  )
  router.post(REGISTER_URL, (req, res, done) => register(req, res, done, config))
  router.post(CREATE_PASS_RESET_SECRET_URL, (req, res, done) => createPasswordResetSecret(req, res, done, config))
  router.post(RESET_PASSWORD_URL, (req, res, done) => resetPassword(req, res, done, config))
  router.post(CHANGE_PASSWORD_URL, (req, res, done) => changePassword(req, res, done, config))
  router.post(CREATE_EMAIL_CHANGE_SECRET_URL, (req, res, done) => createEmailChangeSecret(req, res, done, config))
  router.post(CHANGE_EMAIL_URL, (req, res, done) => changeEmail(req, res, done, config))
}

import {
  LOCAL_LOGIN_URL,
  REGISTER_URL,
  CREATE_PASS_RESET_SECRET_URL,
  RESET_PASSWORD_URL
} from '../isomorphic'
import {
  login,
  register,
  createPasswordResetSecret,
  resetPassword
} from './api'

export default function (opts) {
  const { router, config } = opts

  router.post(LOCAL_LOGIN_URL, login)
  router.post(REGISTER_URL, (req, res, done) => register(req, res, done, config))
  router.post(CREATE_PASS_RESET_SECRET_URL, (req, res, done) => createPasswordResetSecret(req, res, done, config))
  router.post(RESET_PASSWORD_URL, (req, res, done) => resetPassword(req, res, done, config))
}

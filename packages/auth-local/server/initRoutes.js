import {
  LOCAL_LOGIN_URL,
  REGISTER_URL,
  CREATE_PASS_RESET_SECRET_URL
} from '../isomorphic'
import {
  login,
  register,
  createPasswordResetSecret
} from './api'

export default function (opts) {
  const {
    router
    // config
  } = opts

  router.post(LOCAL_LOGIN_URL, login)
  router.post(REGISTER_URL, register)
  router.post(CREATE_PASS_RESET_SECRET_URL, createPasswordResetSecret)
}

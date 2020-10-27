import _get from 'lodash/get'
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
import { finishAuth, setAuthInfo } from '@startupjs/auth/server'
import passport from 'passport'

export default function (opts) {
  const { router, config } = opts

  router.post(LOCAL_LOGIN_URL, login, finishAuth)
  router.post(REGISTER_URL, register)
  router.post(CREATE_PASS_RESET_SECRET_URL, createPasswordResetSecret)
}

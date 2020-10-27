import {
  LINKEDIN_WEB_LOGIN_URL,
  CALLBACK_NATIVE_LINKEDIN_URL,
  CALLBACK_LINKEDIN_URL
} from '../isomorphic'
import {
  loginWeb,
  loginWebCallback,
  loginNative
} from './api'
import { finishAuth, ensureAuthState } from '@startupjs/auth/server'

export default function (opts) {
  const { router, config } = opts

  // Web routes
  router.get(LINKEDIN_WEB_LOGIN_URL, loginWeb)
  router.get(CALLBACK_LINKEDIN_URL, loginWebCallback)
  //

  // Native routes
  router.get(
    CALLBACK_NATIVE_LINKEDIN_URL,
    (req, res, next) => loginNative(req, res, next, config),
    ensureAuthState,
    finishAuth
  )
  //
}

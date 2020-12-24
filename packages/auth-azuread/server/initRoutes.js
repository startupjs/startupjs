import { parseRedirectUrl } from '@startupjs/auth/server'
import {
  AZUREAD_WEB_LOGIN_URL,
  CALLBACK_AZUREAD_URL,
  CALLBACK_NATIVE_AZUREAD_URL
} from '../isomorphic'
import {
  loginWeb,
  loginWebCallback,
  loginNative
} from './api'

export default function (options) {
  const { router, config } = options

  // Web routes
  router.get(AZUREAD_WEB_LOGIN_URL, parseRedirectUrl, loginWeb)
  router.post(
    CALLBACK_AZUREAD_URL,
    (req, res, next) => loginWebCallback(req, res, next, config)
  )

  // Native routes
  router.get(
    CALLBACK_NATIVE_AZUREAD_URL,
    (req, res, next) => loginNative(req, res, next, config)
  )
}

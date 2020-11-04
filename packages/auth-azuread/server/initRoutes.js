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

export default function (opts) {
  const { router, config } = opts

  // Web routes
  router.get(AZUREAD_WEB_LOGIN_URL, loginWeb)
  router.post(CALLBACK_AZUREAD_URL, loginWebCallback)
  //

  // Native routes
  router.get(
    CALLBACK_NATIVE_AZUREAD_URL,
    (req, res, next) => loginNative(req, res, next, config)
  )
  //
}

import { WEB_LOGIN_URL, CALLBACK_URL, CALLBACK_NATIVE_URL } from '../isomorphic'
import {
  loginWeb,
  loginWebCallback,
  loginNative
} from './api'

export default function (opts) {
  const { router, config } = opts

  // Web routes
  router.get(WEB_LOGIN_URL, loginWeb)
  router.get(CALLBACK_URL, loginWebCallback)

  // Native routes
  router.post(
    CALLBACK_NATIVE_URL,
    (req, res, next) => loginNative(req, res, next, config)
  )
}

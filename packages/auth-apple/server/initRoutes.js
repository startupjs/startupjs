import {
  WEB_LOGIN_URL,
  CALLBACK_URL,
  CALLBACK_NATIVE_URL,
  CALLBACK_NATIVE_FINISH_URL
} from '../isomorphic'
import {
  loginWeb,
  loginWebCallback,
  loginNative,
  loginNativeFinish
} from './api'

export default function (options) {
  const { router, config } = options

  // Web routes
  router.get(WEB_LOGIN_URL, loginWeb)
  router.post(
    CALLBACK_URL,
    (req, res, next) => loginWebCallback(req, res, next, config)
  )

  // Native routes
  router.post(
    CALLBACK_NATIVE_URL,
    (req, res) => loginNative(req, res, config)
  )
  router.get(
    CALLBACK_NATIVE_FINISH_URL,
    (req, res, next) => loginNativeFinish(req, res, next, config)
  )
}

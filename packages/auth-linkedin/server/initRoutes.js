import { parseRedirectUrl } from '@startupjs/auth/server'
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

export default function (options) {
  const { router, config } = options

  // Web routes
  router.get(LINKEDIN_WEB_LOGIN_URL, parseRedirectUrl, loginWeb)
  router.get(
    CALLBACK_LINKEDIN_URL,
    (req, res, next) => loginWebCallback(req, res, next, config)
  )

  // Native routes
  router.get(
    CALLBACK_NATIVE_LINKEDIN_URL,
    (req, res, next) => loginNative(req, res, next, config)
  )
}

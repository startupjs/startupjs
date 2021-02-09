import { parseRedirectUrl } from '@startupjs/auth/server'
import { LOGIN_URL, CALLBACK_URL } from '../isomorphic'
import { login, loginCallback } from './api'

export default function (options) {
  const { router, config } = options

  router.get(LOGIN_URL, parseRedirectUrl, login)
  router.get(
    CALLBACK_URL,
    (req, res, next) => loginCallback(req, res, next, config)
  )
}

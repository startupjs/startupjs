import { LOGIN_URL, CALLBACK_URL } from '../isomorphic'
import { login, loginCallback } from './api'

export default function (options) {
  const { router, config } = options

  router.post(LOGIN_URL, login, config)

  router.get(
    CALLBACK_URL,
    (req, res, next) => loginCallback(req, res, next, config)
  )
}

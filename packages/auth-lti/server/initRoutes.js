import { LOGIN_URL } from '../isomorphic'
import { login, loginCallback } from './api'

export default function (options) {
  const { router, config } = options

  router.post(LOGIN_URL, (req, res, next) => login(req, res, next, config))

  router.get(
    config.callbackUrl,
    (req, res, next) => loginCallback(req, res, next, config)
  )
}

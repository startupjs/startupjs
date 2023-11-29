import { LOGIN_URL } from '../isomorphic/index.js'
import { login, loginCallback } from './api/index.js'

export default function (options) {
  const { router, config } = options

  router.post(LOGIN_URL, (req, res, next) => login(req, res, next, config))

  router.get(
    config.callbackUrl,
    (req, res, next) => loginCallback(req, res, next, config)
  )
}

import { parseRedirectUrl } from '@startupjs/auth/server'
import { login, loginCallback } from './api'

export default function (options) {
  const { router, config } = options

  router.get(
    `/auth/${config.providerName}`,
    parseRedirectUrl,
    (req, res, next) => login(req, res, next, config)
  )

  router.get(
    `/auth/${config.providerName}/callback`,
    (req, res, next) => loginCallback(req, res, next, config)
  )
}

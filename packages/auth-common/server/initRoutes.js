import { login, loginCallback } from './api/index.js'

export default function (options) {
  const { router, config } = options

  router.get(
    `/auth/${config.providerName}`,
    (req, res, next) => login(req, res, next, config)
  )

  router.get(
    `/auth/${config.providerName}/callback`,
    (req, res, next) => loginCallback(req, res, next, config)
  )
}

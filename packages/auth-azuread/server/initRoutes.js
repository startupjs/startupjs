import {
  CALLBACK_AZUREAD_URL,
  AZUREAD_LOGIN_URL
} from '../isomorphic/index.js'
import {
  loginWeb,
  loginCallback
} from './api/index.js'

export default function (options) {
  const { router, config } = options

  router.get(
    AZUREAD_LOGIN_URL,
    (req, res, next) => loginWeb(req, res, next, config)
  )
  router.get(
    CALLBACK_AZUREAD_URL,
    (req, res, next) => loginCallback(req, res, next, config)
  )
}

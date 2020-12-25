import { parseRedirectUrl } from '@startupjs/auth/server'
import {
  // AZUREAD_LOGIN_WEB_URL,
  CALLBACK_AZUREAD_URL,
  AZUREAD_LOGIN_URL
} from '../isomorphic'
import {
  loginWeb,
  // redirectToAzureLogin,
  loginCallback
} from './api'

export default function (options) {
  const { router, config } = options

  router.get(AZUREAD_LOGIN_URL,
    parseRedirectUrl,
    (req, res, next) => loginWeb(req, res, next, config)
  )
  // router.get(AZUREAD_LOGIN_URL,
  //   parseRedirectUrl,
  //   (req, res, next) => redirectToAzureLogin(req, res, next, config)
  // )
  router.get(
    CALLBACK_AZUREAD_URL,
    (req, res, next) => loginCallback(req, res, next, config)
  )
}

import {
  LINKEDIN_WEB_LOGIN_URL,
  CALLBACK_LINKEDIN_URL
} from '../isomorphic'
import {
  loginWeb,
  loginCallback
} from './api'

export default function (options) {
  const { router, config } = options

  router.get(LINKEDIN_WEB_LOGIN_URL, loginWeb)

  router.get(
    CALLBACK_LINKEDIN_URL,
    (req, res, next) => loginCallback(req, res, next, config)
  )
}

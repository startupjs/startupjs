import {
  WEB_LOGIN_URL,
  CALLBACK_URL
} from '../isomorphic'
import {
  loginWeb,
  loginCallback
} from './api'

export default function (options) {
  const { router, config } = options

  router.get(WEB_LOGIN_URL, loginWeb)

  router.get(
    CALLBACK_URL,
    (req, res, next) => loginCallback(req, res, next, config)
  )
}

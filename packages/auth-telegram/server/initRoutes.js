import {
  CALLBACK_URL
} from '../isomorphic'
import {
  loginWeb
} from './api'

export default function (options) {
  const { router, config } = options

  router.get(
    CALLBACK_URL,
    (req, res, next) => loginWeb(req, res, next, config)
  )
}

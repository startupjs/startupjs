import {
  CALLBACK_URL
} from '../isomorphic/index.js'
import {
  loginWeb
} from './api/index.js'

export default function (options) {
  const { router, config } = options

  router.get(
    CALLBACK_URL,
    (req, res, next) => loginWeb(req, res, next, config)
  )
}

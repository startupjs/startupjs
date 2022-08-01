import { ERROR_URL } from '@startupjs/auth/isomorphic'
import { ERROR_MESSAGES } from '../../isomorphic'

export const ERROR_FORMAT_JSON = 'json'
export const ERROR_FORMAT_REDIRECT = 'redirect'
export const ERROR_FORMAT_REGULAR = 'send'

export function sendError (res, err, {
  statusCode = 400,
  type = ERROR_FORMAT_JSON
} = {}) {
  const message = ERROR_MESSAGES[err]
  const errMessage = message || err

  switch (type) {
    case ERROR_FORMAT_REGULAR:
      return res.send(errMessage)

    case ERROR_FORMAT_JSON:
      return res.status(statusCode).json({
        code: message ? err : null,
        message: errMessage
      })

    case ERROR_FORMAT_REDIRECT:
      return res.redirect(`${ERROR_URL}?err=${errMessage}`)

    default:
      throw new Error(`sendError: Unknown type ${type}`)
  }
}

import { checkToken } from '../../server/helpers'
import { init2fa } from '../../server'

export function init (ee, options) {
  init2fa(ee, options)
}

export function send () {
  return null
}

export function check (model, session, token) {
  return checkToken(model, session, token)
}

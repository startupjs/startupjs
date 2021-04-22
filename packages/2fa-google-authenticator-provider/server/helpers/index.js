import { checkToken } from '@startupjs/2fa/server/helpers'

export function send () {
  return null
}

export function check (model, session, token) {
  return checkToken(model, session, token)
}

import { checkToken } from '../../server/helpers'

export function send () {
  return null
}

export function check (model, session, token) {
  return checkToken(model, session, token)
}

import * as speakeasy from 'speakeasy'

export default async function checkToken (model, session, token, window = 1) {
  const userId = session.userId

  const $auths = model.scope(`auths.${userId}`)
  await $auths.subscribe()
  const secret = $auths.get('providers.2fa.base32')

  $auths.unsubscribe()

  if (!secret) return false

  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window
  })
}

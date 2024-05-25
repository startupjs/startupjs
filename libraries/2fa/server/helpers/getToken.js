import * as speakeasy from 'speakeasy'

export default async function getToken (model, session) {
  console.warn('\x1b[33m%s\x1b[0m', '@startupjs/2fa is deprecated. Use @startupjs/2fa-totp-authentication instead. It has same API.')
  const userId = session.userId

  const $auths = model.scope(`auths.${userId}`)
  await $auths.subscribe()
  const secret = $auths.get('providers.2fa')

  $auths.unsubscribe()

  if (!secret) throw new Error('[@startupjs/2fa]: Two factor authentication has not connected!')

  return speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  })
}

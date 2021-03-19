import * as speakeasy from 'speakeasy'
import * as QRCode from 'qrcode'

export async function createOrUpdateSecret (model, session, options) {
  const secretCode = speakeasy.generateSecret({
    name: options.appName
  })

  const secretObj = {
    otpauthUrl: secretCode.otpauth_url,
    base32: secretCode.base32
  }

  const userId = session.userId

  const $auths = model.scope(`auths.${userId}`)
  await $auths.subscribe()
  $auths.set('providers.2fa', { ...secretObj })

  const QRDataURL = await QRCode.toDataURL(secretCode.otpauth_url)

  return {
    ...secretObj,
    QRDataURL
  }
}

export async function checkToken (model, session, token) {
  const userId = session.userId

  const $auths = model.scope(`auths.${userId}`)
  await $auths.subscribe()
  const secret = $auths.get('providers.2fa.base32')

  $auths.unsubscribe()

  if (!secret) return false

  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token
  })
}

export async function getSecret (model, session) {
  const userId = session.userId

  const $auths = model.scope(`auths.${userId}`)
  await $auths.subscribe()
  const secret = $auths.get('providers.2fa')

  if (!secret) throw new Error('Two factor authentication has not connected!')

  const QRDataURL = await QRCode.toDataURL(secret.otpauthUrl)

  $auths.unsubscribe()

  return {
    otpauthUrl: secret.otpauthUrl,
    base32: secret.base32,
    QRDataURL
  }
}

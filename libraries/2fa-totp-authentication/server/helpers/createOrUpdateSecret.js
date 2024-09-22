import * as speakeasy from 'speakeasy'
import * as QRCode from 'qrcode'

export default async function createOrUpdateSecret (model, session, options) {
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

  if (!$auths.get()) {
    $auths.unsubscribe()
    throw new Error('[@startupjs/2fa]: User is not logged in with @startupjs/auth')
  }

  $auths.set('providers.2fa', { ...secretObj })

  const QRDataURL = await QRCode.toDataURL(secretCode.otpauth_url)
  $auths.unsubscribe()
  return {
    base32: secretObj.base32,
    QRDataURL
  }
}

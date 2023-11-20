import { finishAuth, linkAccount } from '@startupjs/auth/server/index.js'
import crypto from 'crypto'
import appleSigninAuth from 'apple-signin-auth'
import Provider from '../Provider.js'

export default async function loginNative (req, res, config) {
  const { onBeforeLoginHook } = config
  const data = req.body

  let profile
  if (data.code) {
    profile = getAndroidProfile(data)
  } else {
    profile = data
  }

  const provider = new Provider(req.model, profile, config)

  // If request came along with authorized session -> link new account to existing auth.providers doc
  if (req.session.loggedIn) {
    const response = await linkAccount(req, provider)
    return res.send(response)
  } else {
    const userId = await provider.findOrCreateUser({ req })
    finishAuth(req, res, { userId, onBeforeLoginHook })
  }
}

async function getAndroidProfile (data) {
  const appleIdTokenClaims = await appleSigninAuth.verifyIdToken(data.id_token, {
    nonce: data.nonce
      ? crypto.createHash('sha256').update(data.nonce).digest('hex')
      : undefined
  })

  const profile = { id: appleIdTokenClaims.sub }
  return profile
}

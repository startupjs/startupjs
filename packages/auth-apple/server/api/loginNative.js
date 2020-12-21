import { finishAuth } from '@startupjs/auth/server'
import crypto from 'crypto'
import appleSigninAuth from 'apple-signin-auth'
import Provider from '../Provider'

export default async function loginNative (req, res, config) {
  const data = req.body

  if (data.code) {
    loginAndroid(req, res, data, config)
  } else {
    loginIOS(req, res, data, config)
  }
}

async function loginIOS (req, res, profile, config) {
  const { successRedirectUrl, onBeforeLoginHook } = config

  const provider = new Provider(req.model, profile, config)
  const userId = await provider.findOrCreateUser()

  finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
}

async function loginAndroid (req, res, data, config) {
  const { successRedirectUrl, onBeforeLoginHook } = config

  const appleIdTokenClaims = await appleSigninAuth.verifyIdToken(data.id_token, {
    nonce: data.nonce
      ? crypto.createHash('sha256').update(data.nonce).digest('hex')
      : undefined
  })

  const profile = {
    id: appleIdTokenClaims.sub
  }

  const provider = new Provider(req.model, profile, config)
  const userId = await provider.findOrCreateUser()

  finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
}

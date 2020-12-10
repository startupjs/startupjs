import appleSignin from 'apple-signin-auth'
import fs from 'fs'
import qs from 'query-string'
import nconf from 'nconf'
import crypto from 'crypto'
import {
  CRYPTO_SECRET_KEY,
  CRYPTO_ALGORITHM,
  CALLBACK_NATIVE_URL,
  FAILURE_LOGIN_URL
} from '../../isomorphic'

export default async function loginNative (req, res, config) {
  const { code } = req.body
  const {
    clientId,
    teamId,
    keyId,
    privateKeyLocation
  } = config

  const clientSecret = appleSignin.getClientSecret({
    clientID: clientId,
    teamID: teamId,
    privateKey: fs.readFileSync(privateKeyLocation),
    keyIdentifier: keyId
  })

  const options = {
    clientID: clientId,
    redirectUri: nconf.get('BASE_URL') + CALLBACK_NATIVE_URL,
    clientSecret
  }

  try {
    const response = await appleSignin.getAuthorizationToken(code, options)

    const { sub: userAppleId } = await appleSignin.verifyIdToken(response.id_token, {
      audience: clientId,
      ignoreExpiration: true
    })

    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(CRYPTO_ALGORITHM, CRYPTO_SECRET_KEY, iv)
    const encrypted = Buffer.concat([cipher.update(userAppleId), cipher.final()])

    res.redirect('/auth/sing-in?' + qs.stringify({
      apple: 1,
      iv: iv.toString('hex'),
      content: encrypted.toString('hex')
    }))
  } catch (err) {
    console.log('[@dmapper/auth-apple] Error: Apple login', err)
    return res.redirect(FAILURE_LOGIN_URL)
  }
}

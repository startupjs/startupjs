// import { finishAuth } from '@startupjs/auth/server'
import appleSignin from 'apple-signin-auth'
import fs from 'fs'
// import nconf from 'nconf'
import { CALLBACK_NATIVE_URL, FAILURE_LOGIN_URL } from '../../isomorphic'
// import Provider from '../Provider'

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
    redirectUri: 'https://7f2183d284ab.ngrok.io' + CALLBACK_NATIVE_URL,
    clientSecret
  }

  try {
    const response = await appleSignin.getAuthorizationToken(code, options)

    const { sub: userAppleId } = await appleSignin.verifyIdToken(response.id_token, {
      audience: clientId,
      ignoreExpiration: true
    })

    res.send({ userAppleId })
  } catch (err) {
    console.log('[@dmapper/auth-apple] Error: Apple login', err)
    return res.redirect(FAILURE_LOGIN_URL)
  }
}

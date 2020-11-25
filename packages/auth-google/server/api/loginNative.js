import { finishAuth } from '@startupjs/auth/server'
import { OAuth2Client } from 'google-auth-library'
import Provider from '../Provider'

export default async function loginNative (req, res, next, config) {
  const {
    clientId,
    clientSecret,
    successRedirectUrl,
    onBeforeLogintHook
  } = config

  const { token } = req.body

  try {
    const profile = await getProfile(token, clientId, clientSecret)
    const provider = new Provider(req.model, profile, config)
    const userId = await provider.findOrCreateUser()

    // onBeforeLogintHook

    finishAuth(req, res, { userId, successRedirectUrl, onBeforeLogintHook })
  } catch (err) {
    console.log('Login with google token error', err)
    return res.status(403).json({ message: 'Access denied' })
  }
}

async function getProfile (token, clientId, clientSecret) {
  const client = new OAuth2Client(clientId, clientSecret)

  const ticket = await client.verifyIdToken({
    idToken: token,
    // Specify the CLIENT_ID of the app that accesses the backend
    audience: clientId
    // Or, if multiple clients access the backend:
    // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  })

  return ticket.getPayload()
}

import { finishAuth, linkAccount } from '@startupjs/auth/server'
import conf from 'nconf'
import { getGoogleIdToken, getGoogleProfile } from '../helpers'
import { CALLBACK_URL } from '../../isomorphic'
import Provider from '../Provider'

export default async function loginWebCallback (req, res, next, config) {
  const {
    clientId,
    clientSecret,
    successRedirectUrl,
    onBeforeLoginHook
  } = config

  let { token, code } = req.query
  let userId

  // Auth request from mobile platforms has "token" param
  // but desktop send "code" param which used to get "idToken"
  if (!token && code) {
    token = await getGoogleIdToken({
      code,
      clientId,
      clientSecret,
      redirectURI: conf.get('BASE_URL') + CALLBACK_URL
    })
  }

  const profile = await getGoogleProfile(token, clientId, clientSecret)

  const provider = new Provider(req.model, profile, config)

  // If request came along with authorized session -> link new account to existing auth.providers doc
  if (req.session.loggedIn) {
    const error = await linkAccount(req, provider)
    userId = req.session.userId

    if (error) {
      return res.status(400).json({ message: error })
    }
  } else {
    userId = await provider.findOrCreateUser()
  }

  finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
}

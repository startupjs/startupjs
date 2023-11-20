import { finishAuth, linkAccount } from '@startupjs/auth/server/index.js'
import { getFBAccessToken, getFBProfile } from '../helpers/index.js'
import { CALLBACK_URL } from '../../isomorphic/index.js'
import Provider from '../Provider.js'

export default async function loginCallback (req, res, next, config) {
  const {
    clientId,
    clientSecret,
    onBeforeLoginHook
  } = config

  let { accessToken, code } = req.query

  // Using to understand which protocol will be used un redirectUrl
  const protocol = process.env.NODE_ENV === 'production' ? 'https://' : 'http://'

  // Auth request from mobile platforms has "accessToken" param
  // but desktop send "code" param which used to get "accessToken"
  if (!accessToken && code) {
    accessToken = await getFBAccessToken({
      clientId,
      clientSecret,
      code,
      redirectURI: protocol + req.get('host') + CALLBACK_URL
    })
  }

  const profile = await getFBProfile(accessToken)

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

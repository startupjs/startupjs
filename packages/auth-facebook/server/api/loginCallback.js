import { finishAuth, linkAccount } from '@startupjs/auth/server'
import conf from 'nconf'
import { getFBAccessToken, getFBProfile } from '../helpers'
import { CALLBACK_URL } from '../../isomorphic'
import Provider from '../Provider'

export default async function loginCallback (req, res, next, config) {
  const {
    clientId,
    clientSecret,
    successRedirectUrl,
    onBeforeLoginHook
  } = config

  let { accessToken, code } = req.query

  // Auth request from mobile platforms has "accessToken" param
  // but desktop send "code" param which used to get "accessToken"
  if (!accessToken && code) {
    accessToken = await getFBAccessToken({
      clientId,
      clientSecret,
      code,
      redirectURI: conf.get('BASE_URL') + CALLBACK_URL
    })
  }

  const profile = await getFBProfile(accessToken)

  const provider = new Provider(req.model, profile, config)

  // If request came along with authorized session -> link new account to existing auth.providers doc
  if (req.session.loggedIn) {
    const response = await linkAccount(req, provider)
    return res.send(response)
  } else {
    const userId = await provider.findOrCreateUser()
    finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
  }
}

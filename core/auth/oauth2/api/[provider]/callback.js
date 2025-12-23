import axios from '@startupjs/utils/axios'
import jwt from 'jsonwebtoken'
import { getProviderConfig, getClientId, getClientSecret } from '../../serverHelpers/providers.js'
import {
  getRedirectUri,
  redirectBackToApp,
  getRedirectUrlFromError,
  redirectBackToAppError
} from '../../serverHelpers/redirect.js'
import { beforeLogin, afterRegister } from '../../serverHelpers/hooks.js'
import getOrCreateAuth from '../../serverHelpers/getOrCreateAuth.js'
import { getPublicError } from '../../serverHelpers/publicError.js'
import getSessionData from '../../serverHelpers/getSessionData.js'

export default ({ providers, storage }) => async (req, res) => {
  let provider
  // get the passed state
  let { state } = req.query
  try { state = JSON.parse(state) } catch (err) {}
  if (typeof state !== 'object') return res.status(400).send('State is invalid')

  try {
    provider = req.params.provider
    const config = getProviderConfig(providers, provider)
    if (!config) return res.status(400).send(`Provider ${provider} is not supported`)
    const { code } = req.query
    if (!code) return res.status(400).send('Code is missing')

    // get the passed state
    let { state } = req.query
    try { state = JSON.parse(state) } catch (err) {}
    if (typeof state !== 'object') return res.status(400).send('State is invalid')

    // get userinfo
    const redirectUri = getRedirectUri(req, provider)
    const accessToken = await getAccessToken(config, provider, { code, redirectUri })
    const userinfo = await getUserinfo(config, provider, { token: accessToken })

    // update or create user
    const { scopes } = state
    if (!Array.isArray(scopes)) return res.status(400).send('Returned scopes are invalid')
    const { userId, registered, $auth } = await getOrCreateAuth(config, provider, { userinfo, token: accessToken, scopes, storage })

    // run hooks
    if (registered) await afterRegister({ $auth, config, provider, userId, state })
    await beforeLogin({ $auth, config, provider, userId })

    // login
    const session = await getSessionData(userId, { storage })
    redirectBackToApp(res, session, state)
  } catch (err) {
    console.warn(`User auth error (${provider}):`, err)
    const redirectUrl = getRedirectUrlFromError(err)

    if (redirectUrl) {
      return redirectBackToAppError({ res, err: { redirectUrl }, state })
    }

    const publicError = getPublicError(err, 'Error during auth. Please try again later')
    redirectBackToAppError({ res, err: { message: publicError }, state })
  }
}

async function getAccessToken (config, provider, { redirectUri, code }) {
  const { tokenUrl } = config
  if (!tokenUrl) throw Error(`Token URL is missing for provider ${provider}`)
  const clientId = getClientId({ config, provider })
  const clientSecret = getClientSecret({ config, provider })
  const res = await axios.post(tokenUrl, {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  })
  let token
  if (typeof res.data === 'string') {
    if (res.data.startsWith('error=')) throw Error(`Error response from ${tokenUrl}: ${res.data}`)
    const params = new URLSearchParams(res.data)
    token = params.get('access_token')
  } else if (typeof res.data === 'object') {
    token = res.data.access_token
  } else {
    throw Error(`Unexpected response from ${tokenUrl}`)
  }
  if (!token) throw Error(`Token is missing in response from ${tokenUrl}`)
  return token
}

async function getUserinfo (config, provider, { token }) {
  const { userinfoUrl } = config
  if (userinfoUrl) {
    const res = await axios.get(userinfoUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const userinfo = res.data
    if (!userinfo) throw Error(`Userinfo is missing in response from ${userinfoUrl}`)
    return userinfo
  } else {
    const decoded = jwt.decode(token)
    if (!decoded) throw Error(ERRORS.missingUserinfoUrl(provider))
    return decoded
  }
}

const ERRORS = {
  missingUserinfoUrl: provider => `
    \`userinfoUrl\` is missing for provider ${provider}.
    And the access_token is an opaque token instead of JWT so no user information can be extracted from it.
  `
}

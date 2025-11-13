import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { beforeLogin, afterRegister } from '../../serverHelpers/hooks.js'
import getSessionData from '../../serverHelpers/getSessionData.js'
import { getPublicError } from '../../serverHelpers/publicError.js'
import { redirectBackToApp, redirectBackToAppError, getRedirectUrlFromError } from '../../serverHelpers/redirect.js'
import getOrCreateAuth from '../../serverHelpers/getOrCreateAuth.js'
import { getProviderConfig } from '../../serverHelpers/providers.js'

export default ({ providers, storage, provider }) => async (req, res) => {
  // get the passed state
  let { state } = req.body
  if (typeof state === 'string') state = JSON.parse(state)
  if (typeof state !== 'object') return res.status(400).send('State is invalid')

  try {
    const config = getProviderConfig(providers, provider)
    if (!config) return res.status(400).send(`Provider ${provider} is not supported`)
    const { id_token: idToken } = req.body
    if (!idToken) return res.status(400).send('Id token is missing')

    // validate the idToken
    const { jwksUrl } = config
    if (!jwksUrl) return res.status(400).send('jwksUrl is not set in config')
    const client = jwksClient({ jwksUri: jwksUrl, timeout: 30000 })
    const { header: { kid } } = jwt.decode(idToken, { complete: true })
    const publicKey = (await client.getSigningKey(kid)).getPublicKey()
    const { sub, email } = jwt.verify(idToken, publicKey)

    // assemble userinfo
    // NOTE: apple sends the name in the magic 'user' field
    let { user } = req.body
    if (typeof user === 'string') user = JSON.parse(user)
    const userinfo = { sub, email, user }

    // get or create user
    // NOTE: apple only provides the user info on initial login, so we never actually "update" it
    const { scopes } = state
    if (!Array.isArray(scopes)) return res.status(400).send('Returned scopes are invalid')
    const { userId, registered, $auth } = await getOrCreateAuth(config, provider, { userinfo, scopes, storage })

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

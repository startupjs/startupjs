import { getProviderConfig, getClientId } from '../serverHelpers/providers.js'
import { getRedirectUri } from '../serverHelpers/redirect.js'

export default ({ providers }) => (req, res) => {
  try {
    const { provider, extraScopes } = req.body
    if (!provider) return res.status(400).send('Provider is not specified')
    const url = getAuthUrl(req, provider, providers, { extraScopes })
    res.json({ url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error during auth' })
  }
}

function getAuthUrl (req, provider, providers, { extraScopes } = {}) {
  const config = getProviderConfig(providers, provider)
  if (!config) throw Error(`Provider ${provider} is not supported`)
  const redirectUri = getRedirectUri(req, provider)
  return _getAuthUrl(config, provider, { redirectUri, extraScopes })
}

function _getAuthUrl (config, provider, { redirectUri, extraScopes = [] }) {
  const { authUrl } = config
  const clientId = getClientId({ config, provider })
  let { scopes, authUrlSearchParams } = config
  if (!scopes) throw Error(ERRORS.missingScopes(provider))
  scopes = [...new Set([...scopes, ...extraScopes])]
  const params = new URLSearchParams(Object.entries({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    ...authUrlSearchParams
  })).toString()
  return `${authUrl}?${params}`
}

const ERRORS = {
  missingScopes: provider => `Scopes are missing for provider ${provider}`
}

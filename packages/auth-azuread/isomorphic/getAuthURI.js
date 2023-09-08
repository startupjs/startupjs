import qs from 'qs'
import { SCOPE, getStrBase64 } from '../isomorphic'

export default function getAuthURI ({
  clientId,
  tenantId,
  redirectURI
}) {
  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${qs.stringify({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectURI,
    scope: SCOPE,
    response_mode: 'query',
    prompt: 'login',
    code_challenge: getStrBase64(`${clientId}_${tenantId}`),
    code_challenge_method: 'plain'
  })}`
}

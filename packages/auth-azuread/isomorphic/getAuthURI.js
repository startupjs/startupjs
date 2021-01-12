import qs from 'qs'
import { SCOPE, getStrBase64 } from '../isomorphic'

export default function getAuthURI ({
  clientId,
  tentantId,
  redirectURI
}) {
  return `https://login.microsoftonline.com/${tentantId}/oauth2/v2.0/authorize?${qs.stringify({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectURI,
    scope: SCOPE,
    response_mode: 'query',
    prompt: 'login',
    code_challenge: getStrBase64(`${clientId}_${tentantId}`),
    code_challenge_method: 'plain'
  })}`
}

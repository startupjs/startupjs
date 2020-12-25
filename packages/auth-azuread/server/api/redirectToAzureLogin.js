import conf from 'nconf'
import { getAuthURI, CALLBACK_AZUREAD_URL } from '../../isomorphic'

export default function redirectToAzureLogin (req, res, next, config) {
  const {
    clientId,
    tentantId
  } = config

  const authURI = getAuthURI({
    clientId,
    tentantId,
    redirectURI: conf.get('BASE_URL') + CALLBACK_AZUREAD_URL
  })

  res.redirect(authURI)
}

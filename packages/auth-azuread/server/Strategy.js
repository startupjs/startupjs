import Provider from './Provider'
import { OIDCStrategy as Strategy } from 'passport-azure-ad'
import initRoutes from './initRoutes'
import passport from 'passport'
import { CALLBACK_AZUREAD_URL } from '../isomorphic'
import nconf from 'nconf'

function validateConfigs ({ clientId, identityMetadata, tentantId }) {
  if (!clientId) {
    throw new Error('[@dmapper/auth-azuread] Error:', 'Provide Client Id')
  }
  if (!identityMetadata) {
    throw new Error('[@dmapper/auth-azuread] Error:', 'Provide Identity Metadata')
  }
  if (!tentantId) {
    throw new Error('[@dmapper/auth-azuread] Error:', 'Provide Tentant Id')
  }
}

export default function (config = {}) {
  this.config = {}

  Object.assign(this.config, {
    allowHttpForRedirectUrl: false
  }, config)

  validateConfigs(this.config)

  const { clientId, identityMetadata, tentantId, allowHttpForRedirectUrl } = this.config

  return ({ model, router, updateClientSession }) => {
    console.log('++++++++++ Initialization of AzureAD auth strategy ++++++++++\n', this.config, '\n')

    const redirectUrl = `${nconf.get('BASE_URL')}${CALLBACK_AZUREAD_URL}`
    const cookieEncryptionKeys = [{ key: model.id().substring(0, 32), iv: model.id().substring(0, 12) }]

    initRoutes({ router, config })

    // Append required configs to client session
    updateClientSession({ azuread: { clientId, tentantId } })

    passport.use(
      new Strategy(
        {
          clientID: clientId,
          identityMetadata,
          responseType: 'id_token',
          responseMode: 'form_post',
          allowHttpForRedirectUrl,
          redirectUrl,
          scope: ['email', 'profile'],
          useCookieInsteadOfSession: true,
          cookieEncryptionKeys
        },
        async function (iss, sub, profile, accessToken, refreshToken, done) {
          let userId, err
          try {
            const provider = new Provider(model, profile)
            userId = await provider.findOrCreateUser()
          } catch (e) {
            err = e
          }
          return done(err, userId)
        }
      )
    )
  }
}

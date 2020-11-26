import { OIDCStrategy as Strategy } from 'passport-azure-ad'
import passport from 'passport'
import nconf from 'nconf'
import Provider from './Provider'
import initRoutes from './initRoutes'
import { CALLBACK_AZUREAD_URL } from '../isomorphic'

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

  return ({ model, router, updateClientSession, authConfig }) => {
    Object.assign(this.config, {
      allowHttpForRedirectUrl: false,
      ...authConfig
    }, config)

    validateConfigs(this.config)

    console.log('++++++++++ Initialization of AzureAD auth strategy ++++++++++\n', this.config, '\n')

    const { clientId, identityMetadata, tentantId, allowHttpForRedirectUrl } = this.config

    const redirectUrl = `${nconf.get('BASE_URL')}${CALLBACK_AZUREAD_URL}`
    const cookieEncryptionKeys = [{ key: model.id().substring(0, 32), iv: model.id().substring(0, 12) }]

    initRoutes({ router, config: this.config })

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
            const provider = new Provider(model, profile, this.config)
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

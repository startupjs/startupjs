import { OIDCStrategy as Strategy } from 'passport-azure-ad'
import passport from 'passport'
import nconf from 'nconf'
import initRoutes from './initRoutes'
import { CALLBACK_AZUREAD_URL } from '../isomorphic'
import Provider from './Provider'

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

  const func = ({ model, router, updateClientSession, authConfig }) => {
    Object.assign(this.config, {
      allowHttpForRedirectUrl: false,
      ...authConfig
    }, config)

    validateConfigs(this.config)

    console.log('++++++++++ Initialization of AzureAD auth strategy ++++++++++\n')

    const { clientId, clientSecret, identityMetadata, tentantId, allowHttpForRedirectUrl } = this.config

    // TODO: make multitentant
    const redirectUrl = `${nconf.get('BASE_URL')}${CALLBACK_AZUREAD_URL}`
    const cookieEncryptionKeys = [{ key: model.id().substring(0, 32), iv: model.id().substring(0, 12) }]

    initRoutes({ router, config: this.config })

    // Append required configs to client session
    updateClientSession({ azuread: { clientId, tentantId } })

    passport.use(
      new Strategy(
        {
          clientID: clientId,
          clientSecret,
          identityMetadata,
          responseType: 'code',
          responseMode: 'query',
          allowHttpForRedirectUrl,
          redirectUrl,
          scope: ['email', 'profile'],
          useCookieInsteadOfSession: true,
          cookieEncryptionKeys,
          passReqToCallback: true
        },
        async (req, iss, sub, profile, accessToken, refreshToken, done) => {
          let userId, err
          try {
            const provider = new Provider(model, profile, this.config)
            userId = await provider.findOrCreateUser({ req })
          } catch (e) {
            err = e
          }
          return done(err, userId)
        }
      )
    )
  }

  func.providerName = 'azuread'
  return func
}

import passport from 'passport'
import { Strategy } from 'passport-google-oauth20'
import Provider from './Provider'
import initRoutes from './initRoutes'
import { CALLBACK_URL } from '../isomorphic'

function validateConfigs ({ clientId, clientSecret }) {
  if (!clientId) {
    throw new Error('[@dmapper/auth-google] Error:', 'Provide Client Id')
  }
  if (!clientSecret) {
    throw new Error('[@dmapper/auth-google] Error:', 'Provide Client Secret')
  }
}

export default function (config = {}) {
  this.config = {}

  return ({ model, router, updateClientSession, authConfig }) => {
    Object.assign(this.config, {
      ...authConfig
      // Any defaults....
    }, config)

    validateConfigs(this.config)

    const { clientId, clientSecret } = this.config

    initRoutes({ router, config: this.config })

    // Append required configs to client session
    updateClientSession({ google: { clientId } })

    console.log('++++++++++ Initialization of Google auth strategy ++++++++++\n')

    passport.use(
      new Strategy(
        {
          clientID: clientId,
          clientSecret,
          callbackURL: CALLBACK_URL,
          userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
        },
        async (accessToken, refreshToken, profile, cb) => {
          let userId, err

          try {
            const provider = new Provider(model, profile, this.config)
            userId = await provider.findOrCreateUser()
          } catch (e) {
            err = e
          }

          return cb(err, userId)
        }
      )
    )
  }
}

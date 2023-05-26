import { Strategy as IdecisiongamesStrategy } from '@dmapper/passport-idg-oauth2'
import passport from 'passport'
import initRoutes from './initRoutes'
import { CALLBACK_URL } from '../isomorphic'
import Provider from './Provider'

function validateConfigs ({ clientId, clientSecret }) {
  if (!clientId) {
    throw new Error('[@dmapper/auth-idg] Error:', 'Provide Client Id')
  }
  if (!clientSecret) {
    throw new Error('[@dmapper/auth-idg] Error:', 'Provide Client Secret')
  }
}

export default function (config = {}) {
  this.config = {}

  const func = ({ router, updateClientSession, authConfig }) => {
    Object.assign(this.config, {
      ...authConfig
      // Any defaults....
    }, config)

    validateConfigs(this.config)

    const { clientId, clientSecret } = this.config

    initRoutes({ router, config: this.config })

    // Append required configs to client session
    updateClientSession({ idg: { clientId } })

    console.log('++++++++++ Initialization of IDG auth strategy ++++++++++\n')

    passport.use(
      new IdecisiongamesStrategy(
        {
          clientID: clientId,
          clientSecret,
          callbackURL: CALLBACK_URL,
          passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, cb) => {
          let userId, err

          try {
            const model = req.model
            const provider = new Provider(model, profile, this.config)
            userId = await provider.findOrCreateUser({ req })
          } catch (e) {
            err = e
          }

          return cb(err, userId)
        }
      )
    )
  }

  func.providerName = 'idg'
  return func
}

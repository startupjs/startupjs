import { Strategy as LTIStrategy } from 'passport-idg-lti'
import passport from 'passport'
import initRoutes from './initRoutes'
import { CALLBACK_URL } from '../isomorphic'
import Provider from './Provider'

function validateConfigs ({ schools }) {
  if (!schools) {
    throw new Error('[@dmapper/auth-lti] Error:', 'Provide schools')
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

    const { clientId, clientSecret, schools } = this.config

    initRoutes({ router, config: this.config })

    // Append required configs to client session
    updateClientSession({ lti: { clientId } })

    console.log('++++++++++ Initialization of LTI auth strategy ++++++++++\n')

    passport.use(
      new LTIStrategy(
        {
          clientID: clientId,
          clientSecret,
          schools: schools,
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

  func.providerName = 'lti'
  return func
}

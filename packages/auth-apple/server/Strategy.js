import passport from 'passport'
import Strategy from '@nicokaiser/passport-apple'
import nconf from 'nconf'
import fs from 'fs'
import Provider from './Provider'
import initRoutes from './initRoutes'
import { CALLBACK_URL } from '../isomorphic/constants'

function validateConfigs ({ clientId, teamId, keyId, privateKeyLocation }) {
  if (!clientId) {
    throw new Error('[@dmapper/auth-apple] Error:', 'Provide Client Id')
  }
  if (!teamId) {
    throw new Error('[@dmapper/auth-apple] Error:', 'Provide Team Id')
  }
  if (!keyId) {
    throw new Error('[@dmapper/auth-apple] Error:', 'Provide Key Id')
  }
  if (!privateKeyLocation) {
    throw new Error('[@dmapper/auth-apple] Error:', 'Provide private key location')
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

    const { clientId, teamId, keyId, privateKeyLocation, testBaseUrl } = this.config

    initRoutes({ router, config: this.config })

    // Append required configs to client session
    updateClientSession({ apple: { clientId, testBaseUrl } })

    console.log('++++++++++ Initialization of Apple auth strategy ++++++++++')

    passport.use(
      new Strategy({
        clientID: clientId,
        teamID: teamId,
        keyID: keyId,
        key: fs.readFileSync(privateKeyLocation),
        scope: ['name', 'email'],
        // TODO: make multitentant
        callbackURL: (testBaseUrl || nconf.get('BASE_URL')) + CALLBACK_URL,
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, cb) => {
        let provider, err

        try {
          const model = req.model
          provider = new Provider(model, profile, this.config)
        } catch (e) {
          err = e
        }

        return cb(err, provider)
      })
    )
  }

  func.providerName = 'apple'
  return func
}

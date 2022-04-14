import passport from 'passport'
import Strategy from 'passport-oauth2'
import nconf from 'nconf'
import initRoutes from './initRoutes'
import Provider from './Provider'

function validateConfigs ({
  providerName,
  clientId,
  clientSecret,
  authorizationURL,
  tokenURL
}) {
  if (!providerName) {
    throw new Error('[@dmapper/auth-common] Error:', 'Provide name for provider')
  }
  if (!clientId) {
    throw new Error('[@dmapper/auth-common] Error:', 'Provide Client Id')
  }
  if (!clientSecret) {
    throw new Error('[@dmapper/auth-common] Error:', 'Provide Client Secret')
  }
  if (!authorizationURL) {
    throw new Error('[@dmapper/auth-common] Error:', 'Provide Authorization URL')
  }
  if (!tokenURL) {
    throw new Error('[@dmapper/auth-common] Error:', 'Provide Token URL')
  }
}

export default function (config = {}) {
  const func = ({ router, updateClientSession, authConfig }) => {
    Object.assign(config, {
      ...authConfig
      // Any defaults....
    }, config)

    validateConfigs(config)

    const {
      clientId,
      clientSecret,
      authorizationURL,
      tokenURL,
      profileURL,
      providerName
    } = config

    initRoutes({ router, config })

    // Append required configs to client session
    updateClientSession({ [providerName]: { clientId } })

    console.log('++++++++++ Initialization of Common auth strategy ' +
    `for ${providerName} ++++++++++\n`)

    const strategy = new Strategy({
      authorizationURL,
      tokenURL,
      callbackURL: nconf.get('BASE_URL') + `/auth/${providerName}/callback`,
      clientID: clientId,
      clientSecret,
      passReqToCallback: true
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      let userId, err

      try {
        const model = req.model
        const provider = new Provider(model, profile, config)
        userId = await provider.findOrCreateUser({ req })
      } catch (e) {
        err = e
      }

      return cb(err, userId)
    })

    strategy.userProfile = function (accessToken, done) {
      const headers = { Authorization: 'Basic ' + accessToken }

      this._oauth2._request('GET', profileURL, headers, null, null, (err, data) => {
        if (err) return done(err)

        try {
          data = JSON.parse(data)
        } catch (e) {
          return done(e)
        }

        done(null, data)
      })
    }

    passport.use(providerName, strategy)
  }

  func.providerName = config.providerName
  return func
}

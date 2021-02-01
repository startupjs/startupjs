import passport from 'passport'
import Strategy from 'passport-oauth2'
import initRoutes from './initRoutes'
import Provider from './Provider'

function validateConfigs ({
  providerName,
  clientId,
  clientSecret,
  authorizationURL,
  tokenURL,
  callbackURL
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
  if (!callbackURL) {
    throw new Error('[@dmapper/auth-common] Error:', 'Provide Callback URL')
  }
}

export default function (config = {}) {
  let $config = {}

  return ({ model, router, updateClientSession, authConfig }) => {
    Object.assign($config, {
      ...authConfig
      // Any defaults....
    }, config)

    validateConfigs($config)

    const {
      clientId,
      clientSecret,
      authorizationURL,
      tokenURL,
      profileURL,
      callbackURL
    } = $config

    initRoutes({ router, config: $config })

    // Append required configs to client session
    updateClientSession({
      [$config.providerName]: {
        clientId,
        authorizationURL
      }
    })

    console.log('++++++++++ Initialization of Common auth strategy ' +
    `for ${$config.providerName} ++++++++++\n`)

    const strategy = new Strategy({
      authorizationURL,
      tokenURL,
      callbackURL,
      clientID: clientId,
      clientSecret
    },
    async function (accessToken, refreshToken, profile, cb) {
      let userId, err

      try {
        const provider = new Provider(model, profile, $config)
        userId = await provider.findOrCreateUser()
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

    passport.use($config.providerName, strategy)
  }
}

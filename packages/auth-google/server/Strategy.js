import passport from 'passport'
import { Strategy } from 'passport-google-oauth20'
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

  const func = ({ router, updateClientSession, authConfig }) => {
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
        // We no need in verify callback
        // We validate a code manually in auth-google/server/api/loginCallback.js
        () => {}
      )
    )
  }

  func.providerName = 'google'
  return func
}

import passport from 'passport'
import { Strategy } from 'passport-facebook'
import initRoutes from './initRoutes.js'
import { CALLBACK_URL, FIELDS } from '../isomorphic/constants.js'

function validateConfigs ({ clientId, clientSecret }) {
  if (!clientId) {
    throw new Error('[@dmapper/auth-facebook] Error:', 'Provide Client Id')
  }
  if (!clientSecret) {
    throw new Error('[@dmapper/auth-facebook] Error:', 'Provide Client Secret')
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
    updateClientSession({ facebook: { clientId } })

    console.log('++++++++++ Initialization of Facebook auth strategy ++++++++++\n')

    passport.use(
      new Strategy(
        {
          clientID: clientId,
          clientSecret,
          callbackURL: CALLBACK_URL,
          profileFields: FIELDS
        },
        // We no need in verify callback
        // We validate a code manually in auth-facebook/server/api/loginCallback.js
        () => {}
      )
    )
  }

  func.providerName = 'facebook'
  return func
}

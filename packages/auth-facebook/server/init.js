import passport from 'passport'
import { Strategy } from 'passport-facebook'
import Provider from './Provider'
import initRoutes from './initRoutes'
import { CALLBACK_URL } from '../isomorphic'

export default function init (opts) {
  console.log('++++++++++ Initialization of Facebook auth strategy ++++++++++')

  const { model, config, updateClientSession } = opts
  const { clientId, clientSecret } = config

  initRoutes(opts)

  // Append required configs to client session
  updateClientSession({ facebook: { clientId } })

  passport.use(
    new Strategy(
      {
        clientID: clientId,
        clientSecret,
        callbackURL: CALLBACK_URL,
        profileFields: ['id', 'email', 'name']
      },
      async function (accessToken, refreshToken, profile, cb) {
        let userId, err

        try {
          const provider = new Provider(model, profile, config)
          userId = await provider.findOrCreateUser()
        } catch (e) {
          err = e
        }

        return cb(err, userId)
      }
    )
  )
}

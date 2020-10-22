import Provider from './LocalProvider'
import { Strategy } from 'passport-local'
import _get from 'lodash/get'
import initRoutes from './initRoutes'
import passport from 'passport'
import bcrypt from 'bcrypt'

export default function init (opts) {
  console.log('++++++++++ Initialization of local auth strategy ++++++++++')

  const { model, config } = opts

  initRoutes(opts)

  passport.use(
    new Strategy(
      {
        usernameField: 'email'
      },
      async function (email = '', password, cb) {
        const provider = new Provider(model, { email }, config)

        const authData = await provider.loadAuthData()
        if (!authData) return cb(null, false, { message: 'User not found' })

        const hash = _get(authData, 'providers.local.hash')
        const userId = await provider.findOrCreateUser()
        bcrypt.compare(password, hash, function (err, res) {
          if (err) return cb(err)
          if (res === false) {
            return cb(null, false, { message: 'Invalid password' })
          }
          return cb(null, userId)
        })
      }
    )
  )
}
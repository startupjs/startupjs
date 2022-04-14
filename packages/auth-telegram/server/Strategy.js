import passport from 'passport'
import { TelegramStrategy as Strategy } from 'passport-telegram-official'
import initRoutes from './initRoutes'
import Provider from './Provider'

export default function (config = {}) {
  this.config = {}

  const func = ({ router, updateClientSession, authConfig }) => {
    Object.assign(this.config, {
      ...authConfig
      // Any defaults....
    }, config)

    if (!config.botToken) {
      throw new Error('[@dmapper/auth-telegram] Error:', 'Provide botToken')
    }

    const { botToken } = this.config

    initRoutes({ router, config: this.config })

    console.log('++++++++++ Initialization of Telegram auth strategy ++++++++++\n')

    passport.use(
      new Strategy({
        botToken,
        passReqToCallback: true
      },
      async (req, profile, cb) => {
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

  func.providerName = 'telegram'
  return func
}

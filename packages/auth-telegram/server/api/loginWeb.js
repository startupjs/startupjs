import { finishAuth, linkAccount } from '@startupjs/auth/server/index.js'
import passport from 'passport'

export default function loginWeb (req, res, next, config) {
  const { onBeforeLoginHook } = config

  passport.authenticate('telegram', async function (err, provider) {
    if (err) {
      console.log('[@startup/auth-telegram] Error:', err)
      res.status(500).json({ error: err })
    }

    // If request came along with authorized session -> link new account to existing auth.providers doc
    if (req.session.loggedIn) {
      const response = await linkAccount(req, provider)
      return res.send(response)
    } else {
      const userId = await provider.findOrCreateUser({ req })
      finishAuth(req, res, { userId, onBeforeLoginHook })
    }
  })(req, res, next)
}

import { finishAuth, linkAccount } from '@startupjs/auth/server'
import passport from 'passport'

export default function loginWebCallback (req, res, next, config) {
  const { successRedirectUrl, onBeforeLoginHook } = config

  passport.authenticate('apple', async function (err, provider) {
    if (err) {
      console.log('[@startup/auth-apple] Error:', err)
      res.status(500).json({ error: err })
    }

    // If request came along with authorized session -> link new account to existing auth.providers doc
    if (req.session.loggedIn) {
      const response = await linkAccount(req, provider)
      return res.send(response)
    } else {
      const userId = await provider.findOrCreateUser({ req })
      finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
    }
  })(req, res, next)
}

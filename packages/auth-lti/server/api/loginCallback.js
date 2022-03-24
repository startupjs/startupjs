import { finishAuth, linkAccount } from '@startupjs/auth/server'
import passport from 'passport'
import Provider from '../Provider'

export default function loginWebCallback (req, res, next, config) {
  const { onBeforeLoginHook } = config

  const profile = req.session.ltiProfile

  passport.authenticate('lti', async function () {
    let provider

    try {
      provider = new Provider(req.model, profile, config)
    } catch (e) {
      console.log('[@startup/auth-lti] Error:', e)
      return res.status(500).json({ error: e })
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

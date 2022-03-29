import { finishAuth, linkAccount } from '@startupjs/auth/server'
import passport from 'passport'
import Provider from '../Provider'

export default function loginWebCallback (req, res, next, config) {
  const { onBeforeLoginHook } = config

  passport.authenticate('lti', async function (err, profile) {
    if (err) {
      return res.status(500).json({ error: err })
    }

    let provider

    try {
      provider = new Provider(req.model, profile, config)
    } catch (e) {
      console.log('[@startup/auth-lti] Error:', e)
      return res.status(500).json({ error: e })
    }

    if (req.query.redirect) {
      req.cookies.authRedirectUrl = req.query.redirect
    }

    const userId = await provider.findOrCreateUser({ req })
    finishAuth(req, res, { userId, onBeforeLoginHook })
  })(req, res, next)
}

import { finishAuth, linkAccount } from '@startupjs/auth/server'
import passport from 'passport'
import conf from 'nconf'
import { getGoogleIdToken, getGoogleProfile } from '../helpers'
import { CALLBACK_URL } from '../../isomorphic'
import Provider from '../Provider'

export default async function loginWebCallback (req, res, next, config) {
  const { token } = req.query

  // If request came along with authorized session -> link new account to existtion auth.providers doc
  if (req.session.loggedIn) {
    await _linkAccount({ req, res, config })
    return
  }

  // Auth request from mobile platforms with idToken param
  if (token) {
    await tokenAuth({ req, res, config, token })
  } else {
    // Auth request from web platforms with code param
    codeAuth({ req, res, next, config })
  }
}

async function _linkAccount ({ req, res, config }) {
  const {
    clientId,
    clientSecret,
    successRedirectUrl,
    onBeforeLoginHook
  } = config
  let { token, code } = req.query

  // We can receive code param from web auth
  // toke param came along with requests from mobile platforms
  if (!token && code) {
    token = await getGoogleIdToken({
      code,
      clientId,
      clientSecret,
      redirectURI: conf.get('BASE_URL') + CALLBACK_URL
    })
  }

  // Get google profile
  const profile = await getGoogleProfile(token, clientId, clientSecret)

  // Generatee provider data
  const newProvider = new Provider(req.model, profile, config)

  const error = await linkAccount(req, newProvider)

  if (error) {
    return res.status(400).json({ message: error })
  }

  return finishAuth(req, res, {
    userId: req.session.userId,
    successRedirectUrl,
    onBeforeLoginHook
  })
}

async function tokenAuth ({ req, res, config, token }) {
  const {
    clientId,
    clientSecret,
    successRedirectUrl,
    onBeforeLoginHook
  } = config

  const profile = await getGoogleProfile(token, clientId, clientSecret)

  const provider = new Provider(req.model, profile, config)
  const userId = await provider.findOrCreateUser()

  finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
}

function codeAuth ({ req, res, next, config }) {
  const {
    successRedirectUrl,
    onBeforeLoginHook
  } = config

  passport.authenticate('google', function (err, userId) {
    if (err) {
      console.log('[@startup/auth-google] Error:', err)
      res.status(500).json({ error: err })
    }

    finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
  })(req, res, next)
}

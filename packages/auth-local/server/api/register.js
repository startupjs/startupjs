import { checkRecaptcha } from '@startupjs/recaptcha/server'
import bcrypt from 'bcrypt'
import Provider from '../Provider'

export default function (req, res, done, config) {
  const { onBeforeRegister, onAfterRegister, emailRegistrationRegexp } = config

  function _done (err) {
    if (err) return res.status(403).json({ message: err })

    register(req, config, async function (err, userId) {
      if (err) return res.status(403).json({ message: err })

      await onAfterRegister({ userId }, req)

      return res.json(userId)
    })
  }

  onBeforeRegister(req, res, _done, { emailRegistrationRegexp })
}

async function register (req, config, done) {
  const { model } = req
  const email = req.body.email.toLowerCase()
  const password = req.body.password
  const recaptchaEnabled = model.get('_session.auth.recaptchaEnabled')

  if (recaptchaEnabled) {
    const checkTokenResponse = await checkRecaptcha(req.body.recaptcha)
    if (!checkTokenResponse) return done('Recaptcha token is invalid')
  }
  delete req.body.recaptcha

  // You can pass custom values to new user with help of userData parameter
  // For example we can pass userId from session
  const profile = req.body || {}

  try {
    profile.email = email.toLowerCase()
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    profile.hash = hash
    profile.salt = salt

    const provider = new Provider(model, profile, config)
    const authData = await provider.options.loadAuthData({ req })
    if (authData) {
      return done('User already exists')
    }

    const userId = await provider.findOrCreateUser({ req })

    done(null, userId)
  } catch (err) {
    console.log('[startupjs/auth] Error', err)
    done(err)
  }
}

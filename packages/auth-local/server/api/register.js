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

  // You can pass custom values to new user with help of userData parameter
  // For example we can pass userId from session
  const userData = req.body.userData || {}

  try {
    const profile = { email: email.toLowerCase(), ...userData }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    profile.hash = hash
    profile.salt = salt

    const provider = new Provider(model, profile, config)
    const authData = await provider.loadAuthData()
    if (authData) {
      return done('User already exists')
    }

    const userId = await provider.findOrCreateUser()

    done(null, userId)
  } catch (err) {
    console.log('[startupjs/auth] Error', err)
    done(err)
  }
}

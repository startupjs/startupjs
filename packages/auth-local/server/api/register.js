import { checkRecaptcha } from '@startupjs/recaptcha/server'
import bcrypt from 'bcrypt'
import setConfirmRegistrationData from './setConfirmRegistrationData'
import Provider from '../Provider'

export default function (config) {
  return function (req, res, next) {
    const { onBeforeRegister, onAfterRegister, emailRegistrationRegexp } = config

    onBeforeRegister(req, res, async function (err, userData) {
      if (err) return res.status(403).json({ message: err })

      register(req, userData, config, async function (err, userId) {
        if (err) return res.status(403).json({ message: err })

        if (config.confirmRegistration) {
          try {
            await setConfirmRegistrationData(req.model, userId, config.confirmEmailTimeLimit)
          } catch (e) {
            return res.status(403).json({ message: e.message })
          }

          config.sendRegistrationConfirmation(req, userId, async function (err) {
            if (err) return next(err)

            await onAfterRegister({ userId }, req)
            return res.json(userId)
          })
        } else {
          config.sendRegistrationInfo(req, userId, async function (err) {
            if (err) return next(err)

            await onAfterRegister({ userId }, req)
            return res.json(userId)
          })
        }


      })
    }, { emailRegistrationRegexp })
  }
}

async function register (req, userData, config, next) {
  const { model } = req
  const email = req.body.email.toLowerCase()
  const password = req.body.password
  const recaptchaEnabled = model.get('_session.auth.recaptchaEnabled')

  if (recaptchaEnabled) {
    const checkTokenResponse = await checkRecaptcha(req.body.recaptcha)
    if (!checkTokenResponse) return next('Recaptcha token is invalid')
  }
  delete req.body.recaptcha

  // You can pass custom values to new user with help of userData parameter
  // For example we can pass userId from session
  const profile = Object.assign({}, req.body, userData)

  try {
    profile.email = email.toLowerCase()
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    profile.hash = hash
    profile.salt = salt

    const provider = new Provider(model, profile, config)
    const authData = await provider.loadAuthData()
    if (authData) {
      return next('User already exists')
    }

    const userId = await provider.findOrCreateUser({ req })

    next(null, userId)
  } catch (err) {
    console.log('[startupjs/auth] Error', err)
    next(err)
  }
}

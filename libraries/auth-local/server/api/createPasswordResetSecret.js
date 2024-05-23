import { checkRecaptcha } from '@startupjs/recaptcha/server/index.js'
import { createPasswordResetSecret as _createPasswordResetSecret } from '../helpers/index.js'
import Provider from '../Provider.js'

export default function createPasswordResetSecret (config) {
  return function (req, res) {
    const { onBeforeCreatePasswordResetSecret, onCreatePasswordResetSecret } = config

    onBeforeCreatePasswordResetSecret(req, res, async function (err, email) {
      if (err) return res.status(400).json({ message: err })
      email = email.toLowerCase()
      const { model } = req

      const recaptchaEnabled = model.get('_session.auth.recaptchaEnabled')

      if (recaptchaEnabled) {
        const checkTokenResponse = await checkRecaptcha(req.body.recaptcha)
        if (!checkTokenResponse) {
          return res.status(400).json({
            message: 'Recaptcha token is invalid'
          })
        }
      }
      delete req.body.recaptcha

      try {
        const secret = await _createPasswordResetSecret({ model, email, config })

        const provider = new Provider(model, { email }, config)
        const auth = await provider.loadAuthData()

        const hookRes = onCreatePasswordResetSecret({ userId: auth.id, secret }, req)
        hookRes && hookRes.then && await hookRes

        res.send('Secret for password reset has been created')
      } catch (error) {
        res.status(400).send({ message: error.message })
      }
    })
  }
}

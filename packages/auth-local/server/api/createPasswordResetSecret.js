import { checkRecaptcha } from '@startupjs/recaptcha/server'
import { createPasswordResetSecret as _createPasswordResetSecret } from '../helpers'

export default function createPasswordResetSecret (req, res, done, config) {
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
      const secret = await _createPasswordResetSecret({ model, email })

      const $auths = model.query('auths', { email })
      await model.fetch($auths)

      const auth = $auths.get()[0]

      model.unfetch($auths)

      const hookRes = onCreatePasswordResetSecret({ userId: auth.id, secret }, req)
      hookRes && hookRes.then && await hookRes

      res.send('Secret for password reset has been created')
    } catch (error) {
      res.status(400).send({ message: error.message })
    }
  })
}

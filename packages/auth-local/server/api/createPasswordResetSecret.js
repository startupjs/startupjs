import { checkToken } from '@startupjs/recaptcha/server'

export default function createPasswordResetSecret (req, res, done, config) {
  const { onBeforeCreatePasswordResetSecret, onCreatePasswordResetSecret } = config

  onBeforeCreatePasswordResetSecret(req, res, async function (err, email) {
    if (err) return res.status(400).json({ message: err })
    const { model } = req

    const recaptchaEnabled = model.get('_session.Recaptcha.authRecaptchaEnabled')

    if (recaptchaEnabled) {
      const checkTokenResponse = await checkToken(req.body.recaptchaToken)
      if (!checkTokenResponse) {
        return res.status(400).json({
          message: 'Recaptcha token is invalid'
        })
      }
    }
    delete req.body.recaptchaToken

    const $auths = model.query('auths', { email })
    await model.fetchAsync($auths)

    const userId = $auths.getIds()[0]
    if (!userId) return res.status(400).json({ message: 'Email not found' })

    const $auth = model.scope('auths.' + userId)
    const $local = $auth.at('providers.local')

    // Generate secret as uuid
    const secret = model.id()
    // Save secret to user
    const passwordReset = {
      secret,
      timestamp: +new Date()
    }
    await $local.setAsync('passwordReset', passwordReset)

    const hookRes = onCreatePasswordResetSecret({ userId, secret }, req)
    hookRes && hookRes.then && await hookRes

    res.send('Secret for password reset has been created')
  })
}

import bcrypt from 'bcrypt'

export default function resetPassword (req, res, done, config) {
  const { resetPasswordTimeLimit, onPasswordReset } = config
  const { secret, password } = req.body

  parseResetPasswordRequest(req, res, async function (err) {
    if (err) return res.status(400).json({ message: err })

    const { model } = req

    const $auths = model.query('auths', { 'providers.local.passwordReset.secret': secret })
    await model.fetchAsync($auths)

    const userId = $auths.getIds()[0]
    if (!userId) return res.status(400).json({ message: 'No user found by secret' })

    const $auth = model.scope('auths.' + userId)
    const $local = $auth.at('providers.local')

    const timestamp = $local.get('passwordReset.timestamp')
    const now = +new Date()

    if (timestamp + resetPasswordTimeLimit < now) {
      return res.status(400).json({ message: 'Secret is expired' })
    }

    // Save password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await $local.set('salt', salt)
    await $local.set('hash', hash)

    // Remove used secret
    await $local.del('passwordReset')

    onPasswordReset(userId)

    res.send('Password reset completed')
  })
}

function parseResetPasswordRequest (req, res, done) {
  const { secret, password, confirm } = req.body

  if (!secret) return done('Missing secret')
  if (!password) return done('Missing password')
  if (!confirm) return done('Missing password confirm')
  if (password !== confirm) return done('Password should match confirmation')

  done(null)
}

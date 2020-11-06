import bcrypt from 'bcrypt'

export default function resetPassword (req, res, done, config) {
  const { resetPasswordTimeLimit } = config
  const { secret, password } = req.body

  parseResetPasswordRequest(req, res, async function (err) {
    if (err) return res.status(400).json({ message: err })

    const { model } = req

    const $auths = model.query('auths', { 'providers.local.passwordReset.secret': secret })
    await model.fetchAsync($auths)

    const id = $auths.getIds()[0]
    if (!id) return res.status(400).json({ message: '[@startup/auth-local] No user found by secret' })

    const $auth = model.scope('auths.' + id)
    const $local = $auth.at('providers.local')

    const timestamp = $local.get('passwordReset.timestamp')
    const now = +new Date()

    if (timestamp + resetPasswordTimeLimit < now) {
      return res.status(400).json({ message: '[@startup/auth-local] Reset password secret expired' })
    }

    // Save password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await $local.set('salt', salt)
    await $local.set('hash', hash)

    // Remove used secret
    await $local.del('passwordReset')

    res.send('[@startup/auth-local] Password reset completed')
  })
}

function parseResetPasswordRequest (req, res, done) {
  const { secret, password, confirm } = req.body

  if (!secret) return done('[@startup/auth-local] Missing secret')
  if (!password) return done('[@startup/auth-local] Missing password')
  if (!confirm) return done('[@startup/auth-local] Missing password confirm')
  if (password !== confirm) return done('[@startup/auth-local] Password should match confirmation')

  done(null)
}

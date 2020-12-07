export default function createPasswordResetSecret (req, res, done, config) {
  const { onCreatePasswordResetSecret } = config

  parseRecoverPasswordRequest(req, res, async function (err, email) {
    if (err) return res.status(400).json({ message: err })
    const { model } = req

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

    const hookRes = onCreatePasswordResetSecret({ userId, secret })
    hookRes && hookRes.then && await hookRes

    res.send('Secret for password reset has been created')
  })
}

function parseRecoverPasswordRequest (req, res, done) {
  const { email } = req.body

  if (!email) return done('Missing email')

  done(null, email)
}

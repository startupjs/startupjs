export default function createPasswordResetSecret (req, res, done) {
  parseRecoverPasswordRequest(req, res, async function (err, email) {
    if (err) return res.status(400).json({ message: err })
    const { model } = req

    const $auths = model.query('auths', { email })
    await model.fetchAsync($auths)

    const id = $auths.getIds()[0]
    if (!id) return res.status(400).json({ message: '[@startup/auth-local] Email not found' })

    const $auth = model.scope('auths.' + id)
    const $local = $auth.at('providers.local')
    if ($local.get('unconfirmed')) return res.status(400).json({ message: '[@startup/auth-local] User is not confirmed' })

    // Generate secret as uuid
    const secret = model.id()
    // Save secret to user
    const passwordReset = {
      secret: secret,
      timestamp: +new Date()
    }
    await $local.setAsync('passwordReset', passwordReset)

    // TODO: customize hook
    sendRecoveryConfirmation(req, id, email, secret, function () {
      res.status(200).json({ email })
    })
  })
}

function parseRecoverPasswordRequest (req, res, done) {
  const email = req.body.email

  if (!email) return done('[@startup/auth-local] Missing email')

  done(null, email)
}

function sendRecoveryConfirmation (req, userId, email, secret, done) {
  // Place to send a letter with recovery link to your page
  done()
}

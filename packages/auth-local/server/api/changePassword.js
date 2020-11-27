import bcrypt from 'bcrypt'

export default function resetPassword (req, res, done, config) {
  const { onAfterPasswordChange, onBeforePasswordChange } = config

  onBeforePasswordChange(req, res, async function (err) {
    if (err) return res.status(400).json({ message: err })

    const { password, oldPassword } = req.body
    const { model, session } = req
    const { userId } = session

    const $auth = model.scope(`auths.${userId}`)
    await $auth.fetchAsync()

    if (!$auth.get()) return res.status(400).json({ message: 'no user' })

    const oldHash = $auth.get('providers.local.hash')

    const match = await bcrypt.compare(oldPassword, oldHash)
    if (!match) return res.status(400).json({ message: 'Old password is not correct' })

    const newSalt = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash(password, newSalt)

    await $auth.setAsync('providers.local.hash', newHash)
    await $auth.setAsync('providers.local.salt', newSalt)

    onAfterPasswordChange(userId)

    res.send('Password has been changed')
  })
}

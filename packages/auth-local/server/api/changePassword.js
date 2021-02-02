import bcrypt from 'bcrypt'
import Provider from '../Provider'

export default function changePassword (req, res, done, config) {
  const { onAfterPasswordChange, onBeforePasswordChange } = config

  onBeforePasswordChange(req, res, async function (err) {
    if (err) return res.status(400).json({ message: err })

    const { password, oldPassword } = req.body
    const { model, session } = req
    const { userId } = session

    const $auth = model.scope(`auths.${userId}`)
    await $auth.fetchAsync()

    if (!$auth.get()) return res.status(400).json({ message: 'No user' })

    const newSalt = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash(password, newSalt)

    // If auth doc has no local provider -> create it
    if (!$auth.get('providers.local')) {
      const profile = {
        email: $auth.get('email'),
        hash: newHash,
        salt: newSalt
      }

      const provider = new Provider(model, profile, config)
      const authData = await provider.loadAuthData()
      if (authData) {
        return done('User already exists')
      }
      await provider.findOrCreateUser()
    } else {
      // Else change password hash
      const oldHash = $auth.get('providers.local.hash')

      if (oldHash) {
        const match = await bcrypt.compare(oldPassword, oldHash)
        if (!match) return res.status(400).json({ message: 'Old password is not correct' })
      }

      await $auth.setAsync('providers.local.hash', newHash)
      await $auth.setAsync('providers.local.salt', newSalt)
    }

    const hookRes = onAfterPasswordChange({ userId }, req)
    hookRes && hookRes.then && await hookRes

    res.send('Password has been changed')
  })
}

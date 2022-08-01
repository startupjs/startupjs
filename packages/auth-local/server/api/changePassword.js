import bcrypt from 'bcrypt'
import { changePassword as _changePassword } from '../helpers'
import Provider from '../Provider'

export default function changePassword (config) {
  return function (req, res, next) {
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
          return next('User already exists')
        }
        await provider.findOrCreateUser({ req })
      } else {
        // Else change password hash
        const oldHash = $auth.get('providers.local.hash')

        if (oldHash) {
          const match = await bcrypt.compare(oldPassword, oldHash)
          if (!match) return res.status(400).json({ message: 'Old password is not correct' })
        }

        try {
          await _changePassword({ model, userId, password })
        } catch (error) {
          return res.status(400).json({ message: error.message })
        }
      }

      const hookRes = onAfterPasswordChange({ userId }, req)
      hookRes && hookRes.then && await hookRes

      res.send('Password has been changed')
    })
  }
}

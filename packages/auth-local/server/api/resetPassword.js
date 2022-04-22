import { changePassword } from '../helpers'

export default function resetPassword (config) {
  return function (req, res, done) {
    const {
      resetPasswordTimeLimit,
      onBeforePasswordReset,
      onAfterPasswordReset
    } = config
    const { secret, password } = req.body

    onBeforePasswordReset(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err })

      const { model } = req

      const $auths = model.query('auths', { 'providers.local.passwordResetMeta.secret': secret })
      await $auths.fetch()

      const userId = $auths.getIds()[0]
      if (!userId) {
        return res.status(400).json({ message: 'No user found by secret' })
      }

      const $auth = model.scope('auths.' + userId)
      const $local = $auth.at('providers.local')

      const timestamp = $local.get('passwordResetMeta.timestamp')
      const now = +new Date()

      if (timestamp + resetPasswordTimeLimit < now) {
        return res.status(400).json({ message: 'Secret is expired' })
      }

      try {
        await changePassword({ model, userId, password })
      } catch (error) {
        return res.status(400).json({ message: error.message })
      }

      // Remove used secret
      await $local.del('passwordResetMeta')

      const hookRes = onAfterPasswordReset({ userId }, req)
      hookRes && hookRes.then && await hookRes

      res.send('Password reset completed')
    })
  }
}

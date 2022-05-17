import _get from 'lodash/get'
import { changeEmail as _changeEmail } from '../helpers'

export default function changeEmail (config) {
  return function (req, res) {
    const { onAfterEmailChange, onBeforeEmailChange } = config

    onBeforeEmailChange(req, res, async function (err, opts = {}) {
      const { secret, userId } = opts

      if (err) return res.status(400).json({ message: err })

      const { model } = req

      const $auths = model.query('auths', {
        'providers.local.emailChangeMeta.secret': secret,
        _id: userId
      })

      await $auths.fetch()

      try {
        const auth = $auths.get()[0]
        const emailChangeMeta = _get(auth, 'providers.local.emailChangeMeta')

        if (!emailChangeMeta) {
          throw new Error('Provided email secret not found')
        }

        await _changeEmail({ model, email: emailChangeMeta.email, userId, config })

        const hookRes = onAfterEmailChange({ userId }, req)
        hookRes && hookRes.then && await hookRes

        res.send('Done')
      } catch (error) {
        res.status(400).json({ message: error.message })
      } finally {
        await model.scope('auths.' + userId).del('providers.local.emailChangeMeta')
        $auths.unfetch()
      }
    })
  }
}

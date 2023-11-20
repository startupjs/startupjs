import { createEmailChangeSecret as _createEmailChangeSecret } from '../helpers/index.js'

export default function createEmailChangeSecret (config) {
  return function (req, res) {
    const { onBeforeCreateEmailChangeSecret, onCreateEmailChangeSecret } = config

    onBeforeCreateEmailChangeSecret(req, res, async function (err, opts = {}) {
      let { email, userId } = opts
      email = email.toLowerCase()

      if (err) return res.status(400).json({ message: err })

      const { model } = req

      try {
        const secret = await _createEmailChangeSecret({ model, email, userId, config })

        const hookRes = onCreateEmailChangeSecret({ userId, secret }, req)
        hookRes && hookRes.then && await hookRes

        res.send('Done')
      } catch (error) {
        return res.status(400).json({ message: error.message })
      }
    })
  }
}

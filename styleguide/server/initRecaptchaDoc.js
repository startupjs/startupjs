import { checkToken } from '@startupjs/recaptcha/server'
import express from 'express'

const router = express.Router()

export default function (ee) {
  router.post('/api/subscribe-something', async function (req, res) {
    const { token } = req.body

    const isVerified = await checkToken(token)

    if (!isVerified) {
      return res.status(403).send(isVerified)
    }

    return res.status(200).send(isVerified)
  })

  ee.on('afterSession', expressApp => {
    expressApp.use(router)
  })
}

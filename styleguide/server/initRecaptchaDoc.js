import { checkRecaptcha } from '@startupjs/recaptcha/server/index.js'
import express from 'express'

const router = express.Router()

export default function (ee) {
  router.post('/api/subscribe-to-mailing', async function (req, res) {
    const { recaptcha } = req.body

    const isVerified = await checkRecaptcha(recaptcha)

    if (!isVerified) {
      return res.status(403).send(isVerified)
    }

    return res.status(200).send(isVerified)
  })

  ee.on('afterSession', expressApp => {
    expressApp.use(router)
  })
}

import express from 'express'
import sendEmail from './sendEmail'

export default function initRoutes () {
  const router = express.Router()

  router.post('/send-email', async (req, res) => {
    const result = await sendEmail(req.model, { ...req.body, host: req.hostname })
    res.send(result).end()
  })

  return router
}

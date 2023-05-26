import express from 'express'
import sendEmail from './sendEmail'

const router = express.Router()

router.post('/send-email', (req, res) =>
  sendEmail(req.body).then(data => {
    if (!data.success) {
      res.status(400)
      res.send(data)
      return
    }

    res.send(data)
  })
)

export default router

import express from 'express'
import sendEmail from '../../send'

const router = express.Router()

router.post('/send', async (req, res) => {
  const result = await sendEmail(req.model, { ...req.body, host: req.hostname })
  res.send(result).end()
})

export default router

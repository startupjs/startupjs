import express from 'express'
import sendEmail from './sendEmail'

export default function initRoutes () {
  const router = express.Router()

  router.post('/send-email', async (req, res) => {
    const result = await sendEmail(req.model, req.body)
    res.send(result).end()
  })

  // TODO: remove and describe in docs
  // router.get('/unsubscribe', async (req, res) => {
  //   const { model } = req
  //   const { userId } = req.query
  //   const $auth = model.scope(`auths.${userId}`)
  //   await $auth.subscribe()
  //   if (!$auth.get()) return
  //   $auth.set('emailSettings.unsubscribed', true)
  // })

  return router
}

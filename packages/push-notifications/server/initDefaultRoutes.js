import { sendNotification } from './helpers'
import { SEND_URL } from '../isomorphic/constants'

export default function initDefaultRoutes (router, options) {
  router.post(SEND_URL, async function (req, res) {
    try {
      await sendNotification(req.model, req.body)
      res.status(200).end()
    } catch (err) {
      res.status(500).send(err)
    }
  })
}

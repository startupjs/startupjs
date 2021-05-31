import { sendNotification } from './helpers'
import { SEND_URL } from '../isomorphic/constants'

export default function initDefaultRoutes (router, options) {
  router.post(SEND_URL, async function (req, res) {
    try {
      const { userIds, ...data } = req.body
      await sendNotification(userIds, data)
      res.status(200).end()
    } catch (err) {
      res.status(500).send(err)
    }
  })
}

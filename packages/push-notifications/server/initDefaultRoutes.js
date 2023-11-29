import { sendNotification } from './helpers/index.js'
import { SEND_URL } from '../isomorphic/constants.js'

export default function initDefaultRoutes (router) {
  router.post(SEND_URL, async function (req, res) {
    try {
      const { userIds, options } = req.body
      await sendNotification(userIds, options)
      res.status(200).end()
    } catch (err) {
      res.status(500).send(err.message)
    }
  })
}

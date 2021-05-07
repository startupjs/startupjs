import { sendNotification, getUsers } from './helpers'
import { SEND_URL, GET_USERS_URL } from '../isomorphic/constants'

export default function initDefaultRoutes (router, options) {
  router.post(SEND_URL, async function (req, res) {
    await sendNotification(req.model, req.body)
    res.status(200).end()
  })

  router.get(GET_USERS_URL, async function (req, res) {
    const users = await getUsers(req.model)
    res.status(200).send(users)
  })
}

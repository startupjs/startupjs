import nconf from 'nconf'
import { sendNotification } from './helpers'
import { SEND_PUSH, GET_APP_ID } from '../isomorphic/constants'

const ONESIGNAL_APP_ID = nconf.get('ONESIGNAL_APP_ID')

export default function initDefaultRoutes (router, options) {
  router.post(SEND_PUSH, async function (req, res) {
    const { ...data } = req.body

    try {
      sendNotification(data)
    } catch (err) {
      res.status(400).send(err)
    }

    res.status(200).send('ok')
  })

  router.get(GET_APP_ID, function (req, res) {
    if (ONESIGNAL_APP_ID) {
      res.status(200).send(ONESIGNAL_APP_ID)
    } else {
      res.status(400).send('No ONESIGNAL_APP_ID')
    }
  })
}

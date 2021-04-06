import axios from 'axios'
import { ONESIGNAL_REST_KEY, ONESIGNAL_APP_ID } from 'nconf'
import { SEND_PUSH, GET_APP_ID } from '../isomorphic/constants'

const onesignalInstance = axios.create({
  baseURL: 'https://onesignal.com/api/v1/notifications',
  timeout: 1000,
  headers: { Authorization: `Basic ${ONESIGNAL_REST_KEY}` }
})

export default function initDefaultRoutes (router, options) {
  router.post(SEND_PUSH, async function (req, res) {
    const { ...data } = req.body

    try {
      await onesignalInstance.post({
        app_id: ONESIGNAL_APP_ID,
        data
      })
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

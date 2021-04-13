import express from 'express'
import nconf from 'nconf'
import { sendNotification } from './helpers'
import { SEND_PUSH, GET_APP_ID } from '../isomorphic/constants'

const router = express.Router()

const ONESIGNAL_APP_ID = nconf.get('ONESIGNAL_APP_ID')

router.post(SEND_PUSH, async function (req, res) {
  try {
    await sendNotification(req.body)
  } catch (err) {
    res.status(400).send(err)
  }

  res.status(200).end()
})

router.get(GET_APP_ID, function (req, res) {
  if (ONESIGNAL_APP_ID) {
    res.status(200).send(ONESIGNAL_APP_ID)
  } else {
    res.status(400).send(new Error('ONESIGNAL_APP_ID is missing'))
  }
})

export default function routes (expressApp) {
  expressApp.use('/', router)
}

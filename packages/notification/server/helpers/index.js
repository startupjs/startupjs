import axios from 'axios'
import { ONESIGNAL_REST_KEY, ONESIGNAL_APP_ID } from 'nconf'

const onesignalInstance = axios.create({
  baseURL: 'https://onesignal.com/api/v1/notifications',
  timeout: 1000,
  headers: { Authorization: `Basic ${ONESIGNAL_REST_KEY}` }
})

export async function sendNotification (data) {
  await onesignalInstance.post({
    app_id: ONESIGNAL_APP_ID,
    data
  })
}

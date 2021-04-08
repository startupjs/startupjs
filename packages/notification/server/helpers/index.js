import axios from 'axios'
import nconf from 'nconf'

const ONESIGNAL_REST_KEY = nconf.get('ONESIGNAL_REST_KEY')
const ONESIGNAL_APP_ID = nconf.get('ONESIGNAL_APP_ID')

const onesignalInstance = axios.create({
  baseURL: 'https://onesignal.com/api/v1/notifications',
  timeout: 1000,
  headers: { Authorization: `Basic ${ONESIGNAL_REST_KEY}` }
})

export async function sendNotification (data) {
  await onesignalInstance.post('/', {
    ...data,
    app_id: ONESIGNAL_APP_ID
  })
}

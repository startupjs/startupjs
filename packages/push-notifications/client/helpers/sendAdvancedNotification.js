import axios from 'axios'
import { SEND_PUSH } from '../../isomorphic'

export default async function sendAdvancedNotification (data) {
  try {
    const notification = await axios.post(SEND_PUSH, data)
    return notification.data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

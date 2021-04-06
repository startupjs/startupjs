import axios from 'axios'
import { SEND_PUSH } from '../../isomorphic'

export default async function sendNotification (data) {
  try {
    const notification = await axios.post(SEND_PUSH, data)
    return notification
  } catch (err) {
    throw new Error(err.response.data)
  }
}

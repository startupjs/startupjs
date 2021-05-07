import axios from 'axios'
import { SEND_URL } from '../../isomorphic'

export default async function sendNotificationAdvanced (notification) {
  try {
    const { data } = await axios.post(SEND_URL, notification)
    return data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

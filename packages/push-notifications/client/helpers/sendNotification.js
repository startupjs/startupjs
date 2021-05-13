import axios from 'axios'
import { SEND_URL } from '../../isomorphic'

export default async function sendNotification (userIds, options = {}) {
  try {
    const { data } = await axios.post(SEND_URL, { userIds, options })
    return data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

import axios from 'axios'
import { SEND_URL } from '../../isomorphic'

export default async function sendNotification (userIds, title, body, androidChannelId, filters = {}) {
  try {
    const { data } = await axios.post(SEND_URL, { userIds, title, body, androidChannelId, filters })
    return data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

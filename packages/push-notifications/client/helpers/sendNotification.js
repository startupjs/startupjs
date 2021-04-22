import axios from 'axios'
import { SEND_PUSH } from '../../isomorphic'

export default async function sendNotification ({ userIds, title = '', content = '' }) {
  try {
    const notification = await axios.post(SEND_PUSH, {
      include_external_user_ids: userIds,
      headings: { en: title },
      contents: { en: content }
    })
    return notification.data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

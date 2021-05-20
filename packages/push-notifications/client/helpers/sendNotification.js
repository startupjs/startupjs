import axios from 'axios'
import getAllRegistredUserIds from './getAllRegistredUserIds'
import { SEND_URL } from '../../isomorphic'

// options = {
//  title: string,
//  body: string,
//  allUsers: boolean,
//  androidChannelId: ''
//  filters: {
//    platforms: [],
//  },
// }

export default async function sendNotification (userIds, options = {}) {
  try {
    const { allUsers, ..._options } = options
    let _userIds = userIds

    if (!userIds.length && allUsers) {
      _userIds = await getAllRegistredUserIds()
    }

    const { data } = await axios.post(SEND_URL, { userIds: _userIds, options: _options })
    return data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

import axios from 'axios'
import { SEND_URL } from '../../isomorphic'

export default async function send (providerName) {
  try {
    await axios.post(SEND_URL, { providerName })
    return true
  } catch (err) {
    throw new Error(err.response.data)
  }
}

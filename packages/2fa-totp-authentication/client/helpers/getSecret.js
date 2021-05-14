import axios from 'axios'
import { GET_SECRET_URL } from '../../isomorphic'

export default async function getSecret (token) {
  try {
    const secret = await axios.get(GET_SECRET_URL)
    return secret.data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

import axios from 'axios'
import { CREATE_SECRET_URL } from '../../isomorphic'

export default async function createSecret () {
  try {
    const secret = await axios.get(CREATE_SECRET_URL)
    return secret.data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

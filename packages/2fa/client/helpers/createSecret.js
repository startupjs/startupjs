import axios from 'axios'
import { CREATE_SECRET_URL } from '../../isomorphic'

export default async function createSecret (token) {
  const secret = await axios.get(CREATE_SECRET_URL)
  return secret.data
}

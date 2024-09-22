import axios from 'axios'
import { CHECK_TOKEN_URL } from '../../isomorphic'

export default async function checkToken (token) {
  const isValid = await axios.post(CHECK_TOKEN_URL, { token })
  return isValid.data
}

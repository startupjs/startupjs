import axios from 'axios'
import { GET_PROVIDERS_URL } from '../../isomorphic'

export default async function getProviders () {
  try {
    const { data } = await axios.get(GET_PROVIDERS_URL)
    return data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

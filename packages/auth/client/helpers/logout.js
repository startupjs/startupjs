import axios from 'axios'
import { LOGOUT_URL } from '../../isomorphic'
import finishAuth from './finishAuth'

export default function logout () {
  axios.get(LOGOUT_URL).then(finishAuth)
}

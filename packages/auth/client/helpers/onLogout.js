import { $root, emit } from 'startupjs'
import { BASE_URL } from '@env'
import axios from 'axios'
import { LOGOUT_URL } from '../../isomorphic'

export default async function onLogout ({ baseUrl = BASE_URL, redirectUrl } = {}) {
  const _redirectUrl = redirectUrl ||
    $root.get('_session.auth.signInPageUrl') ||
    '/'

  await axios.get(baseUrl + LOGOUT_URL)
  emit('restart', _redirectUrl)
}

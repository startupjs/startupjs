import { $root } from 'startupjs'
import axios from 'axios'
import { LOGOUT_URL } from '../../isomorphic'

export default async function onLogout (redirectUrl) {
  const _redirectUrl = redirectUrl || $root.get('_session.auth.signInPageUrl') || '/'

  await axios.get(LOGOUT_URL)
  window.location.href = _redirectUrl
}

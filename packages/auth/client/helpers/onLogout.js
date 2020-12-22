import { $root } from 'startupjs'
import axios from 'axios'
import { LOGOUT_URL } from '../../isomorphic'

export default async function onLogout (redirectUrl) {
  const _redirectUrl = $root.get('_session.auth.signInPageUrl') || redirectUrl || '/'
  await axios.get(LOGOUT_URL)
  window.location.href = _redirectUrl
}

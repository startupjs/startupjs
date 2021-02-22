import { $root, emit } from 'startupjs'
import axios from 'axios'

export default async function finishAuth (redirectUrl) {
  const successRedirectUrl = redirectUrl ||
    $root.get('$render.query.redirectUrl') ||
    $root.get('_session.auth.successRedirectUrl') ||
    '/'

  const res = await axios.get('/api/serverSession')
  await $root.setEach('_session', res.data)
  emit('url', successRedirectUrl)
}

import { $root, emit } from 'startupjs'

export default async function finishAuth (redirectUrl) {
  const successRedirectUrl = redirectUrl ||
    $root.get('$render.query.redirectUrl') ||
    $root.get('_session.auth.successRedirectUrl') ||
    '/'

  emit('restore', successRedirectUrl)
}

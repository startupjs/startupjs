import { $root, emit } from 'startupjs'

export default async function clientFinishAuth (redirectUrl) {
  if (!$root.get('_session.loggedIn')) {
    emit('restart', redirectUrl)
  }
}

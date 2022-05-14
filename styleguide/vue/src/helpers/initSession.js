import model from '@startupjs/model'
import axios from 'axios'
import useSession from './useSession'

export default async function initSession () {
  const session = useSession()
  const res = await axios.get('/api/serverSession', { withCredentials: true })

  const $user = model.scope(`users.${res.data.userId}`)
  await $user.fetch()
  const user = $user.get()

  session.value = { ...res.data, user }
}

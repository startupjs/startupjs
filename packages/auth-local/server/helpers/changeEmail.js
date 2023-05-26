import { EMAIL_REGEXP } from '../../isomorphic/constants'
import Provider from '../Provider'

export default async function changeEmail ({ email, userId, model, config }) {
  if (!userId) {
    throw new Error('Provide user id')
  }

  if (!email || !EMAIL_REGEXP.test(email)) {
    throw new Error('Provide correct user email')
  }

  const provider = new Provider(model, { email }, config)
  const existingUser = await provider.loadAuthData()

  const $auth = model.scope('auths.' + userId)

  await model.fetch($auth)

  const auth = $auth.get()

  if (existingUser) {
    throw new Error('User with same email is already registered')
  }

  if (!auth) {
    throw new Error('User not found')
  }

  if (!auth?.providers?.local) {
    throw new Error('User has no local auth provider')
  }

  const $user = model.scope('users.' + userId)
  await $user.fetch()

  await $user.set('email', email)
  await $auth.set('email', email)
  await $auth.set('providers.local.email', email)
  if (auth.id) {
    await $auth.set('providers.local.id', email)
  }

  model.unfetch($user, $auth)
}

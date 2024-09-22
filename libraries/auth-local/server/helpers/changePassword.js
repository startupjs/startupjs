import bcrypt from 'bcrypt'
import _get from 'lodash/get.js'

export default async function changePassword ({ model, userId, password }) {
  if (!userId) {
    throw new Error('Provide user id')
  }

  if (!password) {
    throw new Error('Provide password')
  }

  const $auth = model.scope(`auths.${userId}`)
  await $auth.fetch()

  const auth = $auth.get()

  if (!auth) {
    throw new Error('User not found')
  }

  const newSalt = await bcrypt.genSalt(10)
  const newHash = await bcrypt.hash(password, newSalt)

  if (!_get(auth, 'providers.local')) {
    throw new Error('User has no local auth provider')
  }

  await $auth.setAsync('providers.local.hash', newHash)
  await $auth.setAsync('providers.local.salt', newSalt)

  model.unfetch($auth)
}

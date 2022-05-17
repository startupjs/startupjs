import { EMAIL_REGEXP } from '../../isomorphic/constants'
import Provider from '../Provider'

export default async function createEmailChangeSecret ({ email, userId, model, config }) {
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

  // Generate secret as uuid
  const secret = model.id()
  // Save secret to user
  const emailChangeMeta = {
    secret,
    timestamp: +new Date(),
    email
  }

  const $local = $auth.at('providers.local')
  await $local.setAsync('emailChangeMeta', emailChangeMeta)

  model.unfetch($auth, $existingUser)

  return secret
}

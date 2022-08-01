import Provider from '../Provider'

export default async function createPasswordResetSecret ({ model, email, config }) {
  const provider = new Provider(model, { email }, config)
  const auth = await provider.loadAuthData()

  // Check if user exists in auths collection
  if (!auth) {
    throw new Error('User is not found')
  }

  const $auth = model.scope('auths.' + auth.id)
  await $auth.fetch()
  const $local = $auth.at('providers.local')

  // Generate secret as uuid
  const secret = model.id()
  // Save secret to user
  const passwordResetMeta = {
    secret,
    timestamp: +new Date()
  }

  await $local.set('passwordResetMeta', passwordResetMeta)

  return secret
}

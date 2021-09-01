export default async function createPasswordResetSecret ({ model, email }) {
  const $auths = model.query('auths', { email })
  await $auths.fetch()

  const auth = $auths.get()[0]

  // Check if user exists in auths collection
  if (!auth) {
    await $auths.unfetch()
    throw new Error('User is not found')
  }

  // Check if a local provider exist
  if (!auth.providers?.local) {
    await $auths.unfetch()
    throw new Error('The user is registered through an external service')
  }

  const $auth = model.scope('auths.' + auth.id)
  const $local = $auth.at('providers.local')

  // Generate secret as uuid
  const secret = model.id()
  // Save secret to user
  const passwordResetMeta = {
    secret,
    timestamp: +new Date()
  }

  await $local.set('passwordResetMeta', passwordResetMeta)

  await $auths.unfetch()

  return secret
}

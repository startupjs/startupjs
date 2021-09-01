export default async function createPasswordResetSecret ({ model, email }) {
  const $auths = model.query('auths', { 'providers.local.email': email })
  await $auths.fetch()

  const auth = $auths.get()[0]

  // Check if user exists in auths collection
  if (!auth) {
    await $auths.unfetch()

    // Check if another providers exist
    const $rootAuth = model.query('auths', { email })
    await $rootAuth.fetch()
    const rootAuth = $rootAuth.get()[0]
    await $rootAuth.unfetch()

    if (rootAuth?.providers) {
      throw new Error('The user is registered through an external service and can\'t recover the password')
    }

    throw new Error('User is not found')
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

export default async function createPasswordResetSecret ({ model, email }) {
  const $auths = model.query('auths', { 'providers.local.email': email })
  await $auths.fetch()

  const auth = $auths.get()[0]

  if (!auth) {
    throw new Error('User not found')
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

  await $local.setAsync('passwordResetMeta', passwordResetMeta)

  model.unfetch($auth)

  return secret
}

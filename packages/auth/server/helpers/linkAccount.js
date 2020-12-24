export default async function linkAccount (req, provider) {
  const { model } = req
  let error

  const $auth = model.scope('auths.' + req.session.userId)
  await $auth.subscribe()

  const providers = $auth.get('providers')

  const providerName = provider.getProviderName()

  if (providerName in providers) {
    error = '[@startupjs/auth] Error: Another account with same provider already linked'
  } else {
    await $auth.set(
      'providers.' + providerName,
      provider.getAuthData().providers[providerName]
    )
  }

  $auth.unsubscribe()

  return error
}

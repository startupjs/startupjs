import { LINKED_PROVIDER_ERROR_HTML, ACCOUNT_ALREADY_LINKED, ACCOUNT_LINKED_HTML } from '../../isomorphic'

export default async function linkAccount (req, provider) {
  const { model } = req
  let response = ACCOUNT_LINKED_HTML

  const $auth = model.scope('auths.' + req.session.userId)
  await $auth.subscribe()

  const providers = $auth.get('providers')

  const providerName = provider.getProviderName()

  if (providerName in providers) {
    if (provider.getEmail() !== providers[providerName].email) {
      response = LINKED_PROVIDER_ERROR_HTML
    } else {
      response = ACCOUNT_ALREADY_LINKED
    }
  } else {
    await $auth.set(
      'providers.' + providerName,
      provider.getAuthData().providers[providerName]
    )
  }

  $auth.unsubscribe()

  return response
}
